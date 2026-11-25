import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";

// This suite never reads DATABASE_URL or contacts a configured user database.
process.env.STORAGE_MODE = "memory";
process.env.NODE_ENV = "test";
process.env.DATABASE_SCHEMA = "public";
process.env.JWT_SECRET = randomBytes(32).toString("hex");
process.env.SESSION_SECRET = randomBytes(32).toString("hex");
const { createSessionStore } = await import("../sessionStore.js");
const call = (store, method, ...args) =>
  new Promise((resolve, reject) => {
    store[method](...args, (error, result) => (error ? reject(error) : resolve(result)));
  });

test("CSRF sessions survive store replacement and a database close/reopen", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "storytelling-sessions-"));
  let database = new PGlite(directory);
  const adapter = { query: (sql, params) => database.query(sql, params) };
  let store = createSessionStore(adapter);
  try {
    await database.exec(
      "CREATE TABLE http_sessions(sid varchar PRIMARY KEY,sess json NOT NULL,expire timestamp NOT NULL)"
    );
    await call(store, "set", "synthetic-session", {
      cookie: { expires: new Date(Date.now() + 60000) },
      csrfSecret: "synthetic-csrf-state",
    });
    await store.close();
    await database.close();
    database = new PGlite(directory);
    store = createSessionStore(adapter);
    const restored = await call(store, "get", "synthetic-session");
    assert.equal(restored.csrfSecret, "synthetic-csrf-state");
    await call(store, "touch", "synthetic-session", {
      ...restored,
      cookie: { expires: new Date(Date.now() + 120000) },
    });
    assert.ok((await call(store, "get", "synthetic-session")).csrfSecret);
    await call(store, "destroy", "synthetic-session");
    assert.equal(await call(store, "get", "synthetic-session"), undefined);
  } finally {
    await store.close();
    await database.close();
    assert.ok(path.resolve(directory).startsWith(path.resolve(tmpdir()) + path.sep));
    await rm(directory, { recursive: true });
  }
});

test("expired sessions are rejected and explicit pruning removes them", async () => {
  const database = new PGlite();
  const store = createSessionStore({ query: (sql, params) => database.query(sql, params) });
  try {
    await database.exec(
      "CREATE TABLE http_sessions(sid varchar PRIMARY KEY,sess json NOT NULL,expire timestamp NOT NULL)"
    );
    await call(store, "set", "expired", {
      cookie: { expires: new Date(Date.now() - 60000) },
      csrfSecret: "synthetic-expired-state",
    });
    assert.equal(await call(store, "get", "expired"), undefined);
    await call(store, "pruneSessions");
    assert.equal(
      (await database.query("SELECT count(*)::int AS total FROM http_sessions")).rows[0].total,
      0
    );
    assert.equal(store.pruneTimer, undefined);
  } finally {
    await store.close();
    await database.close();
  }
});
