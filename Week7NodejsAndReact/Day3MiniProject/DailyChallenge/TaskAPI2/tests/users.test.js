import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile, mkdir, readdir, unlink, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { once } from "node:events";
import bcrypt from "bcrypt";

test("user demo routes, durable JSON writes and task extension", async t => {
  const temporary = await mkdtemp(join(tmpdir(), "taskapi-users-"));
  const usersFile = join(temporary, "users.json");
  const tasksFile = join(temporary, "tasks.json");
  await writeFile(usersFile, "[]\n");
  await writeFile(tasksFile, "[]\n");
  process.env.TASK_API_USERS_FILE = usersFile;
  process.env.TASK_API_TASKS_FILE = tasksFile;
  const { default: app } = await import("../app.js");
  const server = app.listen(0, "127.0.0.1");
  await once(server, "listening");
  const base = `http://127.0.0.1:${server.address().port}`;
  const profile = {
    name: "Demo",
    lastName: "Learner",
    email: "demo@example.test",
    username: "demo",
    password: "demo-alpha",
  };
  async function request(path, method = "GET", body) {
    const response = await fetch(base + path, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const text = await response.text();
    assert.ok(!text.includes("passwordHash"), "Responses must hide password hashes");
    return { status: response.status, body: text ? JSON.parse(text) : null };
  }
  try {
    await t.test("two forms load with disabled submit controls", async () => {
      for (const path of ["/register.html", "/login.html"]) {
        const response = await fetch(base + path);
        assert.equal(response.status, 200);
        const html = await response.text();
        assert.match(html, /type="submit" disabled/);
        assert.match(html, /role="status"/);
      }
    });
    await t.test("validates registration and stores only bcrypt hashes", async () => {
      assert.equal((await request("/register", "POST", {})).status, 400);
      assert.equal(
        (await request("/register", "POST", { ...profile, email: "invalid" })).status,
        400
      );
      assert.equal(
        (await request("/register", "POST", { ...profile, password: "é".repeat(37) })).status,
        400
      );
      const created = await request("/register", "POST", profile);
      assert.equal(created.status, 201);
      assert.equal(created.body.user.username, "demo");
      assert.ok(!("password" in created.body.user));
      const [stored] = JSON.parse(await readFile(usersFile, "utf8"));
      assert.ok(!("password" in stored));
      assert.ok(await bcrypt.compare(profile.password, stored.passwordHash));
      assert.notEqual(stored.passwordHash, profile.password);
    });
    await t.test(
      "rejects duplicate usernames and reused passwords inside the write queue",
      async () => {
        assert.equal(
          (
            await request("/register", "POST", {
              ...profile,
              username: "DEMO",
              password: "different",
            })
          ).status,
          409
        );
        assert.equal(
          (await request("/register", "POST", { ...profile, username: "other" })).status,
          409
        );
        const concurrent = await Promise.all(
          Array.from({ length: 4 }, (_, i) =>
            request("/register", "POST", {
              ...profile,
              username: "second",
              password: `unique-${i}`,
            })
          )
        );
        assert.equal(concurrent.filter(result => result.status === 201).length, 1);
        assert.equal(concurrent.filter(result => result.status === 409).length, 3);
        assert.equal(JSON.parse(await readFile(usersFile, "utf8")).length, 2);
      }
    );
    await t.test("checks credentials and exposes only public profiles", async () => {
      assert.equal((await request("/login", "POST", {})).status, 400);
      assert.equal(
        (await request("/login", "POST", { username: "demo", password: "x".repeat(73) })).status,
        400
      );
      assert.equal(
        (await request("/login", "POST", { username: "demo", password: "wrong" })).status,
        401
      );
      assert.equal(
        (await request("/login", "POST", { username: "absent", password: "wrong" })).status,
        401
      );
      const loggedIn = await request("/login", "POST", {
        username: "demo",
        password: profile.password,
      });
      assert.equal(loggedIn.status, 200);
      assert.equal(loggedIn.body.user.id, 1);
      assert.equal((await request("/users")).body.length, 2);
      assert.equal((await request("/users/1")).body.email, profile.email);
      assert.equal((await request("/users/999")).status, 404);
    });
    await t.test(
      "updates profiles, hashes replacement passwords and rejects conflicts",
      async () => {
        assert.equal((await request("/users/1", "PUT", {})).status, 400);
        assert.equal((await request("/users/999", "PUT", { name: "Missing" })).status, 404);
        assert.equal((await request("/users/1", "PUT", { username: "second" })).status, 409);
        assert.equal((await request("/users/1", "PUT", { email: "bad" })).status, 400);
        const updated = await request("/users/1", "PUT", {
          name: "Updated",
          password: "replacement",
        });
        assert.equal(updated.status, 200);
        assert.equal(updated.body.user.name, "Updated");
        assert.equal(
          (await request("/login", "POST", { username: "demo", password: profile.password }))
            .status,
          401
        );
        assert.equal(
          (await request("/login", "POST", { username: "demo", password: "replacement" })).status,
          200
        );
      }
    );
    await t.test("reports malformed bodies and storage failures, then recovers", async () => {
      const malformed = await fetch(base + "/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{oops",
      });
      assert.equal(malformed.status, 400);
      const snapshot = await readFile(usersFile);
      await unlink(usersFile);
      assert.equal((await request("/users")).status, 500);
      await writeFile(usersFile, snapshot);
      await writeFile(usersFile, "{broken");
      assert.equal((await request("/users")).status, 500);
      assert.equal(
        (await request("/register", "POST", { ...profile, username: "third", password: "third" }))
          .status,
        500
      );
      await writeFile(usersFile, snapshot);
      assert.equal((await request("/users")).body.length, 2);
      assert.equal((await request("/users/1", "PUT", { lastName: "Recovered" })).status, 200);
    });
    await t.test("preserves the task CRUD extension", async () => {
      const created = await request("/api/tasks", "POST", {
        title: "Keep the task demo",
        priority: "high",
      });
      assert.equal(created.status, 201);
      const id = created.body.id;
      assert.equal((await request(`/api/tasks/${id}`)).body.title, "Keep the task demo");
      assert.equal((await request(`/api/tasks/${id}/toggle`, "PATCH")).body.completed, true);
      assert.equal((await request("/api/tasks/stats")).body.total, 1);
      assert.equal((await request(`/api/tasks/${id}`, "DELETE")).status, 204);
    });
    await t.test("cleans temporary writes and recovers after a failed atomic replace", async () => {
      const { updateUsers } = await import("../models/userStore.js");
      const snapshot = await readFile(usersFile);
      await assert.rejects(
        updateUsers(async () => {
          // Replacing a directory with a file must fail on both Windows and POSIX.
          await unlink(usersFile);
          await mkdir(usersFile);
        })
      );
      assert.ok(!(await readdir(temporary)).some(file => file.endsWith(".tmp")));
      await rm(usersFile, { recursive: true });
      await writeFile(usersFile, snapshot);
      assert.equal(
        (await request("/users/1", "PUT", { name: "Recovered after write failure" })).status,
        200
      );
      assert.equal((await request("/users/1")).body.name, "Recovered after write failure");
    });
  } finally {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
    await rm(temporary, { recursive: true, force: true });
  }
});
