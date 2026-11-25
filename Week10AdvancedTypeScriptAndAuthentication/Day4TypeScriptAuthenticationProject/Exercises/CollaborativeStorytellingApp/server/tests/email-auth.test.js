import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { randomBytes } from "node:crypto";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import test, { after, beforeEach } from "node:test";

// Every credential is synthetic. The PostgreSQL-mode child replaces pg.query
// with embedded PGlite before invoking application code: no service is contacted.
const postgres = process.env.EMAIL_AUTH_TEST_MODE === "postgres";
process.env.NODE_ENV = "test";
process.env.STORAGE_MODE = postgres ? "postgres" : "memory";
process.env.DATABASE_URL = "postgresql://fixture:fixture@127.0.0.1:1/offline_fixture";
process.env.DATABASE_SCHEMA = "public";
process.env.DATABASE_SSL = "false";
process.env.JWT_SECRET = randomBytes(32).toString("hex");
process.env.SESSION_SECRET = randomBytes(32).toString("hex");

const { db, pool } = await import("../models/db.js");
let database;
if (postgres) {
  const { PGlite } = await import("@electric-sql/pglite");
  const { applySchema } = await import("../db/setup.js");
  database = new PGlite();
  await applySchema(
    {
      query: (sql, params) => (params ? database.query(sql, params) : database.exec(sql)),
    },
    "public"
  );
  pool.query = (sql, params) => database.query(sql, params);
}

const bcrypt = (await import("bcrypt")).default;
const { register, login } = await import("../controllers/authController.js");
const { createUser, findUserByEmail, findUserByUsername, toPublicUser } =
  await import("../models/userModel.js");
const { createStory, inviteContributor, listContributors, toPublicStory } =
  await import("../models/storyModel.js");
const password = randomBytes(24).toString("base64url");
const passwordHash = await bcrypt.hash(password, 10);

function response() {
  return {
    statusCode: 200,
    cookies: new Map(),
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
    cookie(name, value, options) {
      this.cookies.set(name, { value, options });
      return this;
    },
    clearCookie(name) {
      this.cookies.delete(name);
      return this;
    },
  };
}

async function call(handler, body) {
  const res = response();
  await handler({ body }, res);
  return res;
}

async function userCount() {
  if (!postgres) return db.users.length;
  return (await database.query("SELECT count(*)::int AS total FROM users")).rows[0].total;
}

beforeEach(async () => {
  if (postgres) await database.exec("TRUNCATE TABLE users RESTART IDENTITY CASCADE");
  else {
    db.users.length = 0;
    db.stories.length = 0;
    db.contributors.length = 0;
    db.refreshSessions.clear();
    db.nextUserId = 1;
    db.nextStoryId = 1;
    db.nextContributorId = 1;
  }
});

after(async () => {
  if (pool) await pool.end();
  if (database) await database.close();
});

test("new registrations reject absent, incorrectly typed and malformed emails without mutation", async () => {
  const invalid = [
    undefined,
    null,
    42,
    {},
    [],
    "",
    "no-domain",
    "a@@example.test",
    "a b@example.test",
    "a..b@example.test",
    ".a@example.test",
    "a@example..test",
    "a@-example.test",
    "a@example-.test",
    "a@example",
    "a\n@example.test",
    `${"a".repeat(65)}@example.test`,
    `a@${"x".repeat(64)}.test`,
  ];
  for (const email of invalid) {
    const res = await call(register, { username: "new_user", email, password });
    assert.equal(res.statusCode, 400);
    assert.deepEqual(res.body, { error: "A valid email address is required" });
  }
  for (const body of [undefined, null, {}, { email: "a@example.test", password }]) {
    assert.equal((await call(register, body)).statusCode, 400);
  }
  assert.equal(await userCount(), 0);
  await assert.rejects(createUser("direct", passwordHash), { status: 400 });
});

test("registration normalizes identity, hashes the password and returns a private session", async () => {
  const res = await call(register, {
    username: "  New_User  ",
    email: "  Reader+Tag@Example.TEST  ",
    password,
  });
  assert.equal(res.statusCode, 201);
  const user = await findUserByUsername("NEW_USER");
  assert.equal(user.email, "reader+tag@example.test");
  assert.notEqual(user.passwordHash, password);
  assert.equal(await bcrypt.compare(password, user.passwordHash), true);
  assert.deepEqual(res.body.user, { id: user.id, username: "new_user" });
  assert.ok(res.body.accessToken);
  assert.equal(res.cookies.get("refreshToken").options.httpOnly, true);
  assert.equal(JSON.stringify(res.body).includes(user.email), false);
  assert.equal((await findUserByEmail(" READER+TAG@EXAMPLE.TEST ")).id, user.id);
});

test("login accepts username, email in the username field, and the explicit email field", async () => {
  const user = await createUser("reader", passwordHash, "reader@example.test");
  for (const identifier of [
    { username: " READER " },
    { username: " READER@EXAMPLE.TEST " },
    { email: " READER@EXAMPLE.TEST " },
  ]) {
    const res = await call(login, { ...identifier, password });
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body.user, toPublicUser(user));
    assert.ok(res.body.accessToken);
  }
  for (const body of [
    undefined,
    { username: {}, password },
    { email: [], password },
    { email: "reader@example.test", password: "incorrect" },
  ]) {
    const res = await call(login, body);
    assert.equal(res.statusCode, 401);
    assert.deepEqual(res.body, { error: "Wrong username or password" });
  }
});

test("historical accounts with no email retain username login without invented addresses", async () => {
  if (postgres) {
    await database.query("INSERT INTO users(username,password_hash) VALUES($1,$2)", [
      "legacy",
      passwordHash,
    ]);
  } else db.users.push({ id: db.nextUserId++, username: "legacy", passwordHash });
  const res = await call(login, { username: " LEGACY ", password });
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body.user, { id: 1, username: "legacy" });
  assert.ok(res.body.accessToken);
  assert.equal(await findUserByEmail("legacy@example.test"), undefined);
});

test("duplicate usernames and case-equivalent emails return clean conflicts", async () => {
  await createUser("reader", passwordHash, "reader@example.test");
  const usernameConflict = await call(register, {
    username: "READER",
    email: "another@example.test",
    password,
  });
  assert.equal(usernameConflict.statusCode, 409);
  assert.deepEqual(usernameConflict.body, { error: "That username is taken" });
  const emailConflict = await call(register, {
    username: "different",
    email: " READER@EXAMPLE.TEST ",
    password,
  });
  assert.equal(emailConflict.statusCode, 409);
  assert.deepEqual(emailConflict.body, { error: "That email is already registered" });
  assert.equal(JSON.stringify(emailConflict.body).includes("reader@example.test"), false);
  assert.equal(JSON.stringify(emailConflict.body).includes("23505"), false);
  assert.equal(await userCount(), 1);
});

test("concurrent registrations have exactly one winner for an email", async () => {
  const results = await Promise.all(
    Array.from({ length: 4 }, (_, index) =>
      call(register, {
        username: `racer_${index}`,
        email: index % 2 ? "RACE@EXAMPLE.TEST" : "race@example.test",
        password,
      })
    )
  );
  assert.equal(results.filter(res => res.statusCode === 201).length, 1);
  assert.equal(results.filter(res => res.statusCode === 409).length, 3);
  assert.equal(await userCount(), 1);
  for (const res of results.filter(item => item.statusCode === 409)) {
    assert.deepEqual(res.body, { error: "That email is already registered" });
  }
});

test("the model independently prevents racing username and email insertions", async () => {
  const results = await Promise.allSettled([
    createUser("first", passwordHash, "shared@example.test"),
    createUser("second", passwordHash, "SHARED@EXAMPLE.TEST"),
  ]);
  assert.equal(results.filter(result => result.status === "fulfilled").length, 1);
  assert.equal(results.find(result => result.status === "rejected").reason.status, 409);
  const first = results.find(result => result.status === "fulfilled").value;
  await assert.rejects(
    createUser(first.username.toUpperCase(), passwordHash, "other@example.test"),
    error => error.status === 409 && !error.message.includes("password_hash")
  );
  assert.equal(await userCount(), 1);
});

test("story and contributor listings do not disclose account emails or password hashes", async () => {
  const author = await createUser("author", passwordHash, "author@example.test");
  const contributor = await createUser("contributor", passwordHash, "contributor@example.test");
  let story = await createStory({
    title: "Privacy fixture",
    content: "Synthetic content",
    authorId: author.id,
  });
  story = await inviteContributor(story, contributor.id);
  const listing = JSON.stringify({
    story: await toPublicStory(story),
    contributors: await listContributors(story.id),
  });
  assert.equal(listing.includes("@example.test"), false);
  assert.equal(listing.includes(passwordHash), false);
  assert.ok(listing.includes("contributor"));
});

if (!postgres) {
  test("the same authentication contract passes with embedded PostgreSQL and actual schema constraints", async () => {
    const run = promisify(execFile);
    const env = { ...process.env, EMAIL_AUTH_TEST_MODE: "postgres" };
    // Start an independent test runner rather than inheriting the parent's worker protocol.
    delete env.NODE_TEST_CONTEXT;
    const { stdout, stderr } = await run(
      process.execPath,
      ["--test", "--test-reporter=tap", fileURLToPath(import.meta.url)],
      {
        env,
        timeout: 60000,
        maxBuffer: 2 * 1024 * 1024,
      }
    );
    assert.match(stdout, /# fail 0/);
    assert.equal(stderr, "");
  });
}
