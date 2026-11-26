import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { readFile } from "node:fs/promises";
import { once } from "node:events";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import pg from "pg";

// Native PostgreSQL is strictly opt-in and loopback-only. No configured .env is read.
const connection = process.env.STORY_SETTINGS_TEST_DATABASE_URL;
if (connection && !["127.0.0.1", "localhost", "[::1]"].includes(new URL(connection).hostname))
  throw new Error("Comment-settings tests require a disposable loopback database");
process.env.DOTENV_CONFIG_PATH = path.join(tmpdir(), "story-settings-no-env");
process.env.NODE_ENV = "test";
process.env.STORAGE_MODE = connection ? "postgres" : "memory";
process.env.DATABASE_URL = connection || "postgres://fixture:fixture@127.0.0.1:1/unused";
process.env.DATABASE_SCHEMA = "settings_" + randomBytes(6).toString("hex");
process.env.DATABASE_SSL = "false";
process.env.JWT_SECRET = randomBytes(32).toString("hex");
process.env.SESSION_SECRET = randomBytes(32).toString("hex");
delete process.env.DATABASE_CA_CERT;
delete process.env.TRUST_PROXY;

await test("new-comment settings preserve discussion and order native writes", async t => {
  const { pool, tables, databaseSchema } = await import("../models/db.js");
  const admin = connection ? new pg.Pool({ connectionString: connection, max: 1 }) : null;
  let server;
  try {
    if (pool) {
      const { applySchema } = await import("../db/setup.js");
      const client = await pool.connect();
      try {
        await applySchema(client, databaseSchema);
      } finally {
        client.release();
      }
    }
    const { default: app } = await import("../app.js");
    const { createComment } = await import("../models/commentModel.js");
    const { changeCommentSettings } = await import("../models/commentSettingsModel.js");
    server = app.listen(0, "127.0.0.1");
    await once(server, "listening");
    const origin = "http://127.0.0.1:" + server.address().port + "/api";
    async function request(agent, route, method = "GET", body, status = 200) {
      const headers = {};
      if (agent.cookies.size)
        headers.cookie = [...agent.cookies].map(([k, v]) => k + "=" + v).join("; ");
      if (agent.token) headers.authorization = "Bearer " + agent.token;
      if (method !== "GET" && agent.csrf) headers["x-csrf-token"] = agent.csrf;
      if (body !== undefined) headers["content-type"] = "application/json";
      const response = await fetch(origin + route, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
      });
      for (const cookie of response.headers.getSetCookie()) {
        const [pair] = cookie.split(";");
        const index = pair.indexOf("=");
        agent.cookies.set(pair.slice(0, index), pair.slice(index + 1));
      }
      const data = response.status === 204 ? undefined : await response.json();
      assert.equal(response.status, status, method + " " + route + " " + JSON.stringify(data));
      return data;
    }
    const password = randomBytes(20).toString("hex");
    async function register(username) {
      const agent = { cookies: new Map() };
      agent.csrf = (await request(agent, "/csrf-token")).csrfToken;
      const data = await request(
        agent,
        "/auth/register",
        "POST",
        { username, email: username + "@example.test", password },
        201
      );
      agent.token = data.accessToken;
      agent.user = data.user;
      return agent;
    }
    const author = await register("settings_author");
    const reader = await register("settings_reader");
    const collaborator = await register("settings_collab");
    const story = (
      await request(
        author,
        "/stories",
        "POST",
        { title: "Local settings fixture", content: "Synthetic text." },
        201
      )
    ).story;
    const settingsRoute = "/stories/" + story.id + "/comment-settings";
    const commentsRoute = "/stories/" + story.id + "/comments";
    const existing = (
      await request(reader, commentsRoute, "POST", { body: "Keep this comment." }, 201)
    ).comment;
    await request(
      author,
      "/stories/" + story.id + "/contributors",
      "POST",
      {
        username: collaborator.user.username,
      },
      201
    );

    if (pool)
      await t.test("old schema keeps original read/create response shapes", async () => {
        assert.deepEqual(await request(author, settingsRoute), {
          supported: false,
          commentsOpen: true,
          canChange: false,
        });
        await request(author, settingsRoute, "PATCH", { commentsOpen: false }, 503);
        assert.deepEqual(Object.keys(await request(reader, commentsRoute)), ["comments"]);
        const roles = [databaseSchema + "_runtime", databaseSchema + "_render"];
        await admin.query(roles.map(role => `CREATE ROLE ${role}`).join(";"));
        try {
          const migration = (
            await readFile(
              new URL("../db/migrations/story-comment-settings-hosted.sql", import.meta.url),
              "utf8"
            )
          )
            .replaceAll("storytelling.stories", tables.stories)
            .replaceAll("storytelling_runtime", roles[0])
            .replaceAll("storytelling_render", roles[1]);
          await pool.query(migration);
          await pool.query(migration);
          assert.equal(
            (
              await pool.query(`SELECT comments_open FROM ${tables.stories} WHERE id = $1`, [
                story.id,
              ])
            ).rows[0].comments_open,
            true
          );
          for (const role of roles) {
            const grants = (
              await admin.query(
                "SELECT has_column_privilege($1,$2,'comments_open','UPDATE') AS allowed, has_column_privilege($1,$2,'title','UPDATE') AS title",
                [role, tables.stories]
              )
            ).rows[0];
            assert.equal(grants.allowed, true);
            assert.equal(grants.title, false);
          }
        } finally {
          for (const role of roles) await admin.query(`DROP OWNED BY ${role}; DROP ROLE ${role}`);
        }
      });

    await t.test("only story author can toggle; malformed values do not change state", async () => {
      assert.deepEqual(await request(author, settingsRoute), {
        supported: true,
        commentsOpen: true,
        canChange: true,
      });
      assert.equal((await request(reader, settingsRoute)).canChange, false);
      for (const agent of [reader, collaborator])
        await request(agent, settingsRoute, "PATCH", { commentsOpen: false }, 403);
      for (const value of [null, 0, "false", {}, []])
        await request(author, settingsRoute, "PATCH", { commentsOpen: value }, 400);
      await request(author, settingsRoute, "PATCH", {}, 400);
      assert.equal((await request(author, settingsRoute)).commentsOpen, true);
    });

    await t.test("closing rejects new posts but preserves existing list and editing", async () => {
      await request(author, settingsRoute, "PATCH", { commentsOpen: false });
      const before = (await request(reader, commentsRoute)).comments;
      assert.ok(before.some(comment => comment.id === existing.id));
      await request(reader, commentsRoute, "POST", { body: "Retain this draft." }, 409);
      assert.deepEqual((await request(reader, commentsRoute)).comments, before);
      await request(reader, commentsRoute + "/" + existing.id, "PATCH", {
        body: "Edited while closed.",
      });
      await request(author, settingsRoute, "PATCH", { commentsOpen: true });
      await request(reader, commentsRoute, "POST", { body: "Retain this draft." }, 201);
      assert.equal(
        (await request(reader, commentsRoute)).comments.at(-1).body,
        "Retain this draft."
      );
    });

    if (pool) {
      await t.test(
        "column capability loss keeps open posting but disables author controls",
        async () => {
          // A disposable role in this disposable schema; no hosted role or data is touched.
          const role = databaseSchema + "_role";
          await admin.query(
            `CREATE ROLE ${role}; GRANT USAGE ON SCHEMA "${databaseSchema}" TO ${role}; GRANT SELECT (id,author_id), UPDATE (title) ON ${tables.stories} TO ${role}; GRANT SELECT,INSERT ON ${tables.story_comments} TO ${role}; GRANT SELECT ON ${tables.users} TO ${role}; GRANT USAGE ON ALL SEQUENCES IN SCHEMA "${databaseSchema}" TO ${role}`
          );
          const originalConnect = pool.connect.bind(pool);
          const originalQuery = pool.query.bind(pool);
          const scoped = await originalConnect();
          try {
            await scoped.query(`SET ROLE ${role}`);
            pool.query = (...args) => scoped.query(...args);
            pool.connect = async () => ({ query: scoped.query.bind(scoped), release() {} });
            await assert.rejects(
              createComment({
                storyId: story.id,
                authorId: reader.user.id,
                body: "No read permission.",
              }),
              error => error.status === 503
            );
            await admin.query(`GRANT SELECT(comments_open) ON ${tables.stories} TO ${role}`);
            const { readCommentSettings } = await import("../models/commentSettingsModel.js");
            assert.equal((await readCommentSettings(story.id)).canChange, false);
            assert.equal(
              (
                await createComment({
                  storyId: story.id,
                  authorId: reader.user.id,
                  body: "Open without settings UPDATE.",
                })
              ).body,
              "Open without settings UPDATE."
            );
            await assert.rejects(
              changeCommentSettings(story.id, author.user.id, false),
              error => error.status === 503
            );
          } finally {
            pool.query = originalQuery;
            pool.connect = originalConnect;
            await scoped.query("RESET ROLE");
            scoped.release();
            await admin.query(`DROP OWNED BY ${role}; DROP ROLE ${role}`);
          }
        }
      );

      for (const first of ["post", "close"])
        await t.test("native two-connection ordering: " + first + " first", async () => {
          await changeCommentSettings(story.id, author.user.id, true);
          const connect = pool.connect.bind(pool);
          let releaseFirst;
          const resume = new Promise(resolve => {
            releaseFirst = resolve;
          });
          let locked;
          const reachedLock = new Promise(resolve => {
            locked = resolve;
          });
          let claimed = false;
          pool.connect = async (...args) => {
            if (args.length) return connect(...args);
            const client = await connect();
            if (claimed) return client;
            claimed = true;
            const query = client.query.bind(client);
            client.query = async (...args) => {
              const result = await query(...args);
              if (typeof args[0] === "string" && args[0].includes("pg_advisory_xact_lock")) {
                locked();
                await resume;
              }
              return result;
            };
            const release = client.release.bind(client);
            client.release = (...args) => {
              client.query = query;
              client.release = release;
              return release(...args);
            };
            return client;
          };
          const post = () =>
            createComment({
              storyId: story.id,
              authorId: reader.user.id,
              body: "Ordered " + first,
            });
          const close = () => changeCommentSettings(story.id, author.user.id, false);
          const a = first === "post" ? post() : close();
          let b;
          try {
            await reachedLock;
            b = (first === "post" ? close() : post()).then(
              value => ({ value }),
              error => ({ error })
            );
            const deadline = Date.now() + 5000;
            let waiting = false;
            while (Date.now() < deadline) {
              waiting = (
                await admin.query(
                  "SELECT EXISTS (SELECT 1 FROM pg_locks WHERE locktype='advisory' AND NOT granted AND database=(SELECT oid FROM pg_database WHERE datname=current_database())) AS waiting"
                )
              ).rows[0].waiting;
              if (waiting) break;
              await new Promise(resolve => setTimeout(resolve, 20));
            }
            assert.equal(waiting, true, "second native session waits on the shared advisory lock");
          } finally {
            releaseFirst();
            pool.connect = connect;
          }
          await a;
          const second = await b;
          if (first === "post") assert.equal(second.value.commentsOpen, false);
          else assert.equal(second.error.status, 409);
          const comments = (await request(reader, commentsRoute)).comments;
          assert.equal(
            comments.filter(comment => comment.body === "Ordered " + first).length,
            first === "post" ? 1 : 0
          );
        });
    }
  } finally {
    if (server)
      await new Promise(resolve => {
        server.close(resolve);
        server.closeIdleConnections();
      });
    if (pool) await pool.end();
    if (admin) {
      await admin.query(`DROP SCHEMA IF EXISTS "${databaseSchema}" CASCADE`);
      await admin.end();
    }
  }
});
