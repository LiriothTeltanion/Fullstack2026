import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { once } from "node:events";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";

/** All fixtures are local; no configured credentials or hosted databases are read. */
export async function exerciseComments(t, mode) {
  process.env.DOTENV_CONFIG_PATH = path.join(tmpdir(), "storytelling-comment-fixture-no-env");
  process.env.NODE_ENV = "test";
  process.env.STORAGE_MODE = mode;
  process.env.DATABASE_SCHEMA = mode === "postgres" ? "comments_fixture" : "public";
  process.env.DATABASE_URL = "postgres://fixture:fixture@127.0.0.1:1/unused_fixture";
  process.env.DATABASE_SSL = "false";
  process.env.JWT_SECRET = randomBytes(32).toString("hex");
  process.env.SESSION_SECRET = randomBytes(32).toString("hex");
  const fixturePassword = randomBytes(24).toString("base64url");
  delete process.env.DATABASE_CA_CERT;
  delete process.env.TRUST_PROXY;

  const { pool, tables } = await import("../models/db.js");
  let directory;
  let database;
  const queries = [];
  if (mode === "postgres") {
    directory = await mkdtemp(path.join(tmpdir(), "storytelling-comments-"));
    database = new PGlite(directory);
    const { applySchema } = await import("../db/setup.js");
    await applySchema(
      { query: (sql, params) => (params ? database.query(sql, params) : database.exec(sql)) },
      "comments_fixture"
    );
    // Execute the actual model SQL against PostgreSQL/PGlite, not mock rows.
    // The pg pool cannot open any native or remote connection in this fixture.
    pool.query = (sql, params) => {
      queries.push(sql);
      return database.query(sql, params);
    };
    pool.connect = async () => {
      throw new Error("Native database connections disabled in fixture");
    };
  }

  const { default: app } = await import("../app.js");
  const { createComment, listComments } = await import("../models/commentModel.js");
  const server = app.listen(0, "127.0.0.1");
  await once(server, "listening");
  const origin = "http://127.0.0.1:" + server.address().port;

  function browser() {
    return { cookies: new Map(), csrf: null, access: null };
  }
  async function request(agent, endpoint, method = "GET", data, expected = 200) {
    const headers = {};
    if (agent.cookies.size)
      headers.cookie = [...agent.cookies].map(([k, v]) => k + "=" + v).join("; ");
    if (agent.access) headers.authorization = "Bearer " + agent.access;
    if (method !== "GET" && agent.csrf) headers["x-csrf-token"] = agent.csrf;
    if (data !== undefined) headers["content-type"] = "application/json";
    const response = await fetch(origin + "/api" + endpoint, {
      method,
      headers,
      body: data === undefined ? undefined : JSON.stringify(data),
    });
    for (const cookie of response.headers.getSetCookie()) {
      const pair = cookie.split(";")[0];
      const separator = pair.indexOf("=");
      agent.cookies.set(pair.slice(0, separator), pair.slice(separator + 1));
    }
    const result = response.status === 204 ? undefined : await response.json();
    assert.equal(response.status, expected, method + " " + endpoint);
    return result;
  }
  async function csrf(agent) {
    agent.csrf = (await request(agent, "/csrf-token")).csrfToken;
  }
  async function register(name) {
    const agent = browser();
    await csrf(agent);
    const response = await request(
      agent,
      "/auth/register",
      "POST",
      {
        username: name,
        email: name + "@example.test",
        password: fixturePassword,
      },
      201
    );
    agent.access = response.accessToken;
    agent.user = response.user;
    return agent;
  }
  const assertComment = (comment, storyId, agent, body) => {
    assert.deepEqual(Object.keys(comment).sort(), ["author", "body", "createdAt", "id", "storyId"]);
    assert.ok(Number.isSafeInteger(comment.id) && comment.id > 0);
    assert.equal(comment.storyId, storyId);
    assert.deepEqual(comment.author, { id: agent.user.id, username: agent.user.username });
    assert.equal(comment.body, body);
    assert.equal(new Date(comment.createdAt).toISOString(), comment.createdAt);
  };

  try {
    const author = await register("comments_author");
    const reader = await register("comments_reader");
    const guest = browser();
    const story = (
      await request(
        author,
        "/stories",
        "POST",
        { title: "Comments fixture", content: "A local story." },
        201
      )
    ).story;
    const other = (
      await request(
        author,
        "/stories",
        "POST",
        { title: "Separate fixture", content: "Preserve this story." },
        201
      )
    ).story;
    const endpoint = "/stories/" + story.id + "/comments";
    let lastComment;

    await t.test(
      "authenticated readers can list an empty discussion; guests cannot use it",
      async () => {
        const visible = await request(reader, "/stories");
        assert.ok(visible.stories.some(item => item.id === story.id));
        assert.deepEqual(await request(reader, endpoint), { comments: [] });
        await request(guest, endpoint, "GET", undefined, 401);
        await csrf(guest);
        await request(guest, endpoint, "POST", { body: "A normal comment." }, 401);
      }
    );

    await t.test(
      "comment authors come from authentication and only public identity is serialized",
      async () => {
        const first = (await request(author, endpoint, "POST", { body: "  First comment.\n" }, 201))
          .comment;
        assertComment(first, story.id, author, "First comment.");
        const second = (
          await request(
            reader,
            endpoint,
            "POST",
            {
              body: "Reader comment.",
              author: author.user,
              authorId: author.user.id,
            },
            201
          )
        ).comment;
        assertComment(second, story.id, reader, "Reader comment.");
        const listed = (await request(reader, endpoint)).comments;
        assert.deepEqual(
          listed.map(item => item.id),
          [first.id, second.id]
        );
        assert.ok(listed.every(item => !JSON.stringify(item).includes("passwordHash")));
        assert.ok(
          listed.every(item => Object.keys(item.author).sort().join(",") === "id,username")
        );
        lastComment = second;
      }
    );

    await t.test(
      "one-character and 2000-Unicode-character comments are retained exactly",
      async () => {
        const small = (await request(reader, endpoint, "POST", { body: "x" }, 201)).comment;
        assertComment(small, story.id, reader, "x");
        const unicode = "🎸".repeat(2000);
        const boundary = (await request(reader, endpoint, "POST", { body: unicode }, 201)).comment;
        assertComment(boundary, story.id, reader, unicode);
        if (database) {
          assert.equal(
            (
              await database.query(
                `SELECT char_length(body) AS size FROM ${tables.story_comments} WHERE id = $1`,
                [boundary.id]
              )
            ).rows[0].size,
            2000
          );
        }
        lastComment = boundary;
      }
    );

    await t.test(
      "missing, blank, non-text and overlong bodies fail without changing rows or IDs",
      async () => {
        const before = (await request(reader, endpoint)).comments;
        for (const data of [
          {},
          { body: null },
          { body: false },
          { body: 7 },
          { body: {} },
          { body: [] },
          { body: "" },
          { body: " \n\t " },
          { body: "x".repeat(2001) },
          { body: "🎸".repeat(2001) },
        ]) {
          const response = await request(reader, endpoint, "POST", data, 400);
          assert.match(response.error, /1 and 2000/);
        }
        assert.deepEqual((await request(reader, endpoint)).comments, before);
        const next = (await request(reader, endpoint, "POST", { body: "Still valid." }, 201))
          .comment;
        assert.equal(next.id, lastComment.id + 1);
      }
    );

    await t.test("missing stories return 404 without accepting comments", async () => {
      await request(reader, "/stories/999999/comments", "GET", undefined, 404);
      await request(reader, "/stories/999999/comments", "POST", { body: "Normal text." }, 404);
    });

    if (database) {
      await t.test(
        "PostgreSQL comments and author identity survive database close/reopen",
        async () => {
          const before = (await request(reader, endpoint)).comments;
          await database.close();
          database = new PGlite(directory);
          assert.deepEqual((await request(reader, endpoint)).comments, before);
        }
      );
      await t.test("comment SQL uses one public-field JOIN per list or insert", async () => {
        queries.length = 0;
        const listed = await listComments(story.id);
        assert.ok(listed.length);
        assert.equal(queries.length, 1);
        assert.match(queries[0], /JOIN/);
        assert.ok(!queries[0].includes("SELECT *"));
        assert.ok(!queries[0].includes("password_hash") && !queries[0].includes("email"));
        queries.length = 0;
        const added = await createComment({
          storyId: story.id,
          authorId: reader.user.id,
          body: "One SQL write.",
        });
        assertComment(added, story.id, reader, "One SQL write.");
        assert.equal(queries.length, 1);
        assert.match(queries[0], /WITH inserted/);
        assert.match(queries[0], /JOIN/);
        assert.ok(!queries[0].includes("password_hash") && !queries[0].includes("email"));
      });
    }

    await t.test("deleting a story cascades only its own discussion", async () => {
      const separate = "/stories/" + other.id + "/comments";
      await request(reader, separate, "POST", { body: "Keep this discussion." }, 201);
      await request(author, "/stories/" + story.id, "DELETE", undefined, 204);
      await request(reader, endpoint, "GET", undefined, 404);
      assert.deepEqual(await listComments(story.id), []);
      assert.equal((await request(reader, separate)).comments[0].body, "Keep this discussion.");
    });

    if (database) {
      await t.test(
        "hosted comments migration is repeatable with RLS and both runtime-role grants",
        async () => {
          const { applySchema } = await import("../db/setup.js");
          await applySchema(
            { query: (sql, params) => (params ? database.query(sql, params) : database.exec(sql)) },
            "storytelling"
          );
          await database.exec(
            "CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role; CREATE ROLE storytelling_runtime; CREATE ROLE storytelling_render;"
          );
          await database.exec(
            "GRANT USAGE ON SCHEMA storytelling TO storytelling_runtime, storytelling_render; GRANT SELECT ON storytelling.users, storytelling.stories TO storytelling_runtime, storytelling_render;"
          );
          await database.exec(
            "INSERT INTO storytelling.users(username,password_hash) VALUES ('migration_author','synthetic'); INSERT INTO storytelling.stories(title,content,author_id) VALUES ('Migration fixture','Local only',1);"
          );
          const migration = await readFile(
            new URL("../db/migrations/story-comments-hosted.sql", import.meta.url),
            "utf8"
          );
          await database.exec(migration);
          await database.exec(migration);
          const policy = (
            await database.query(
              "SELECT roles, qual, with_check FROM pg_policies WHERE schemaname='storytelling' AND tablename='story_comments'"
            )
          ).rows;
          assert.equal(policy.length, 1);
          assert.deepEqual([...policy[0].roles].sort(), [
            "storytelling_render",
            "storytelling_runtime",
          ]);
          assert.equal(
            (
              await database.query(
                "SELECT relrowsecurity FROM pg_class WHERE oid='storytelling.story_comments'::regclass"
              )
            ).rows[0].relrowsecurity,
            true
          );
          for (const role of ["storytelling_runtime", "storytelling_render"]) {
            assert.equal(
              (
                await database.query(
                  "SELECT has_table_privilege($1,'storytelling.story_comments','UPDATE') AS allowed",
                  [role]
                )
              ).rows[0].allowed,
              false
            );
            assert.equal(
              (
                await database.query(
                  "SELECT has_table_privilege($1,'storytelling.story_comments','DELETE') AS allowed",
                  [role]
                )
              ).rows[0].allowed,
              false
            );
            await database.exec("SET ROLE " + role);
            try {
              await database.query(
                "INSERT INTO storytelling.story_comments(story_id,author_id,body) VALUES (1,1,$1)",
                [role + " fixture"]
              );
              assert.ok(
                (await database.query("SELECT id,body FROM storytelling.story_comments")).rows
                  .length
              );
            } finally {
              await database.exec("RESET ROLE");
            }
          }
          assert.equal(
            (
              await database.query(
                "SELECT has_table_privilege('anon','storytelling.story_comments','SELECT') AS allowed"
              )
            ).rows[0].allowed,
            false
          );
          assert.equal(
            (
              await database.query(
                "SELECT has_table_privilege('authenticated','storytelling.story_comments','INSERT') AS allowed"
              )
            ).rows[0].allowed,
            false
          );
          await assert.rejects(
            database.query(
              "INSERT INTO storytelling.story_comments(story_id,author_id,body) VALUES (1,1,$1)",
              ["x".repeat(2001)]
            ),
            error => error.code === "23514"
          );
          await database.exec(
            "GRANT DELETE ON storytelling.stories TO storytelling_render; SET ROLE storytelling_render;"
          );
          try {
            await database.exec("DELETE FROM storytelling.stories WHERE id=1");
          } finally {
            await database.exec("RESET ROLE");
          }
          assert.equal(
            (await database.query("SELECT count(*)::int AS total FROM storytelling.story_comments"))
              .rows[0].total,
            0
          );
        }
      );
    }
  } finally {
    await new Promise(resolve => {
      server.close(resolve);
      server.closeIdleConnections();
    });
    if (pool) await pool.end();
    if (database) await database.close();
    if (directory) {
      assert.ok(path.resolve(directory).startsWith(path.resolve(tmpdir()) + path.sep));
      await rm(directory, { recursive: true });
    }
  }
}
