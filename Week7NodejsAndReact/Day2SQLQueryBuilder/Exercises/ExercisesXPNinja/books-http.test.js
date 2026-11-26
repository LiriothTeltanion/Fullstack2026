import assert from "node:assert/strict";
import test from "node:test";
import { createApp } from "./app.js";

// This observed boundary proves rejected input never reaches SQL. Separate
// PostgreSQL integration QA runs the unchanged Knex queries and migrations.
async function fixture(run, failure) {
  const inserts = [];
  const queries = [];
  const logs = [];
  const db = table => {
    queries.push(table);
    if (table === "authors") {
      return {
        where: ({ id }) => ({
          first: async () => (Number(id) === 1 ? { id: 1, name: "Fixture author" } : undefined),
        }),
      };
    }
    assert.equal(table, "books");
    return {
      select() {
        return {
          where: () => ({ orderBy: async () => [{ id: 1, title: "Fixture book", year: 2026 }] }),
        };
      },
      insert(record) {
        inserts.push(record);
        return {
          async returning(columns) {
            assert.equal(columns, "*");
            if (failure) throw failure;
            return [{ id: inserts.length, ...record }];
          },
        };
      },
    };
  };
  const server = createApp(db, { error: message => logs.push(message) }).listen(0, "127.0.0.1");
  await new Promise(resolve => server.once("listening", resolve));
  const url = `http://127.0.0.1:${server.address().port}/books`;
  const send = async (body, raw = false) => {
    const response = await fetch(url, {
      method: "POST",
      ...(body === undefined
        ? {}
        : {
            headers: { "Content-Type": "application/json" },
            body: raw ? body : JSON.stringify(body),
          }),
    });
    return { status: response.status, body: await response.json() };
  };
  const get = async path => {
    const response = await fetch(url.replace(/\/books$/, "") + path);
    return { status: response.status, body: await response.json() };
  };
  try {
    await run({ send, get, inserts, queries, logs });
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
}

test("absent and non-object bodies return 400 without a database query", () =>
  fixture(async ({ send, inserts }) => {
    for (const body of [undefined, [], null]) assert.equal((await send(body)).status, 400);
    assert.equal(inserts.length, 0);
  }));

test("malformed JSON returns 400 and the next valid request still succeeds", () =>
  fixture(async ({ send, inserts, logs }) => {
    const invalid = await send('{"title":', true);
    assert.deepEqual(invalid, { status: 400, body: { error: "Send a valid JSON object." } });
    assert.equal(inserts.length, 0);
    assert.equal(logs.length, 0);
    assert.equal((await send({ title: "Dune", author_id: 1 })).status, 201);
  }));

test("blank and non-string titles return 400 without inserting", () =>
  fixture(async ({ send, inserts }) => {
    for (const title of ["", " \n\t", null, 123, false, {}, []]) {
      assert.equal((await send({ title, author_id: 1 })).status, 400);
    }
    assert.equal(inserts.length, 0);
  }));

test("title length matches PostgreSQL Unicode character semantics", () =>
  fixture(async ({ send, inserts }) => {
    assert.equal((await send({ title: "🌱".repeat(200), author_id: 1 })).status, 201);
    assert.equal((await send({ title: "🌱".repeat(201), author_id: 1 })).status, 400);
    assert.equal(inserts.length, 1);
  }));

test("malformed or out-of-range author IDs return 400 before SQL", () =>
  fixture(async ({ send, inserts }) => {
    for (const author_id of [
      undefined,
      null,
      false,
      {},
      [],
      "",
      "not-an-id",
      "2.2",
      1.5,
      0,
      -1,
      2147483648,
    ]) {
      assert.equal((await send({ title: "Dune", author_id })).status, 400);
    }
    assert.equal(inserts.length, 0);
  }));

test("valid numeric strings, original title text and optional years remain compatible", () =>
  fixture(async ({ send, inserts }) => {
    const input = { title: "  The Hobbit  ", author_id: " 2 ", year: "1937" };
    assert.equal((await send(input)).status, 201);
    assert.deepEqual(inserts[0], input);
    for (const year of [undefined, null, 0, -44, "2000"]) {
      assert.equal((await send({ title: "Fixture book", author_id: 1, year })).status, 201);
    }
  }));

test("invalid optional years return 400 with no insert", () =>
  fixture(async ({ send, inserts }) => {
    for (const year of ["", "unknown", false, {}, [], 2000.5, 2147483648, -2147483649]) {
      assert.equal((await send({ title: "Fixture book", author_id: 1, year })).status, 400);
    }
    assert.equal(inserts.length, 0);
  }));

test("actual database failures keep 500 and their private server log", () =>
  fixture(async ({ send, logs }) => {
    const result = await send({ title: "Fixture book", author_id: 1 });
    assert.deepEqual(result, { status: 500, body: { error: "Database error" } });
    assert.deepEqual(logs, ["Fixture database unavailable"]);
  }, new Error("Fixture database unavailable")));

test("invalid author route IDs return 400 without querying", () =>
  fixture(async ({ get, queries }) => {
    for (const id of ["not-an-id", "2.5", "0", "-1", "2147483648"]) {
      assert.equal((await get(`/authors/${id}/books`)).status, 400);
    }
    assert.equal(queries.length, 0);
  }));

test("valid author routes retain 200 and 404 behavior", () =>
  fixture(async ({ get }) => {
    assert.deepEqual(await get("/authors/1/books"), {
      status: 200,
      body: { author: "Fixture author", books: [{ id: 1, title: "Fixture book", year: 2026 }] },
    });
    assert.deepEqual(await get("/authors/999999/books"), {
      status: 404,
      body: { error: "Author not found" },
    });
  }));

test("the book author foreign key maps to 404 without hiding unrelated failures", async () => {
  const missingAuthor = Object.assign(new Error("Fixture author was removed"), {
    code: "23503",
    constraint: "books_author_id_foreign",
  });
  await fixture(async ({ send, logs }) => {
    assert.deepEqual(await send({ title: "Fixture book", author_id: 99 }), {
      status: 404,
      body: { error: "Author not found" },
    });
    assert.equal(logs.length, 0);
  }, missingAuthor);
  const unrelated = Object.assign(new Error("Fixture different constraint"), {
    code: "23503",
    constraint: "other_foreign_key",
  });
  await fixture(async ({ send, logs }) => {
    assert.equal((await send({ title: "Fixture book", author_id: 1 })).status, 500);
    assert.deepEqual(logs, ["Fixture different constraint"]);
  }, unrelated);
});
