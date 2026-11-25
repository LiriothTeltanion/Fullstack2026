import test from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import bcrypt from "bcrypt";
import { createFixture } from "../db/fixture.js";
import { createUserModel } from "../userModel.js";
import { createApp } from "../app.js";

test(
  "registration and sign-in through Knex and the PostgreSQL wire protocol",
  { timeout: 30000 },
  async t => {
    const fixture = await createFixture();
    const users = createUserModel(fixture.db);
    const server = createApp(users).listen(0, "127.0.0.1");
    await once(server, "listening");
    const base = `http://127.0.0.1:${server.address().port}`;
    const account = { name: "Demo Learner", email: "demo@example.test", password: "demo-pass" };
    async function request(path, body) {
      const response = await fetch(
        base + path,
        body
          ? {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
            }
          : undefined
      );
      const data = await response.json();
      assert.ok(!("hash" in data) && !("password" in data));
      return { status: response.status, data };
    }
    try {
      await t.test("GET process health and registration validation", async () => {
        assert.equal((await request("/api/health")).data.status, "ok");
        for (const body of [
          {},
          { ...account, email: "invalid" },
          { ...account, name: " " },
          { ...account, password: "é".repeat(37) },
        ]) {
          assert.equal((await request("/api/register", body)).status, 400);
        }
      });
      await t.test("creates users/login rows together and stores a bcrypt hash", async () => {
        const response = await request("/api/register", {
          ...account,
          email: " DEMO@example.test ",
        });
        assert.equal(response.status, 201);
        assert.equal(response.data.email, account.email);
        assert.match(response.data.joined, /^\d{4}-\d{2}-\d{2}$/);
        assert.equal((await fixture.db("users")).length, 1);
        const [login] = await fixture.db("login");
        assert.ok(await bcrypt.compare(account.password, login.hash));
        assert.notEqual(login.hash, account.password);
      });
      await t.test("duplicate registration is visible and leaves one account", async () => {
        const duplicate = await request("/register", account);
        assert.equal(duplicate.status, 409);
        assert.equal(duplicate.data.error, "already registered");
        assert.equal((await fixture.db("users")).length, 1);
        assert.equal((await fixture.db("login")).length, 1);
      });
      await t.test(
        "correct credentials return the dashboard profile; failures say not registered",
        async () => {
          const response = await request("/signin", {
            email: account.email,
            password: account.password,
          });
          assert.equal(response.status, 200);
          assert.equal(response.data.name, account.name);
          for (const body of [
            { email: account.email, password: "wrong" },
            { email: "absent@example.test", password: "wrong" },
            {},
          ]) {
            const failure = await request("/api/signin", body);
            assert.ok([400, 401].includes(failure.status));
            assert.equal(failure.data.error, "not registered");
          }
        }
      );
      await t.test("the transaction rolls back the user when the hash insert fails", async () => {
        await assert.rejects(
          users.createUser({ name: "Rollback", email: "rollback@example.test" }, null),
          error => error.code === "23502"
        );
        assert.equal(
          (await fixture.db("users").where({ email: "rollback@example.test" })).length,
          0
        );
      });
      await t.test("concurrent duplicate requests create one row pair", async () => {
        const results = await Promise.all(
          Array.from({ length: 3 }, () =>
            request("/register", { ...account, email: "parallel@example.test" })
          )
        );
        assert.equal(results.filter(result => result.status === 201).length, 1);
        assert.equal(results.filter(result => result.status === 409).length, 2);
        assert.equal(
          (await fixture.db("users").where({ email: "parallel@example.test" })).length,
          1
        );
        assert.equal(
          (await fixture.db("login").where({ email: "parallel@example.test" })).length,
          1
        );
      });
      await t.test(
        "request parse errors and database errors return JSON without internal details",
        async () => {
          const invalid = await fetch(base + "/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: "{bad",
          });
          assert.equal(invalid.status, 400);
          await fixture.db.schema.dropTable("login");
          const failed = await request("/api/signin", {
            email: account.email,
            password: account.password,
          });
          assert.equal(failed.status, 503);
          assert.equal(failed.data.error, "The account service is temporarily unavailable.");
        }
      );
    } finally {
      server.closeAllConnections();
      await new Promise(resolve => server.close(resolve));
      await fixture.close();
    }
  }
);
