import test from "node:test";
import assert from "node:assert/strict";
import { createAddItemHandler } from "../controllers/createItemHandler.js";

function response() {
  return {
    statusCode: 200,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

function fixture() {
  const rows = [{ id: 1, title: "Existing task", done: false }];
  const handler = createAddItemHandler(async title => {
    const item = { id: rows.length + 1, title, done: false };
    rows.push(item);
    return item;
  });
  return {
    rows,
    async request(body) {
      const res = response();
      await handler({ body }, res, error => {
        throw error;
      });
      return res;
    },
  };
}

test("item creation rejects absent bodies and non-string titles before persistence", async () => {
  const { rows, request } = fixture();
  const before = structuredClone(rows);
  for (const body of [
    undefined,
    null,
    [],
    "text",
    123,
    true,
    {},
    { title: undefined },
    { title: null },
    { title: 123 },
    { title: false },
    { title: [] },
    { title: {} },
  ]) {
    assert.equal((await request(body)).statusCode, 400, JSON.stringify(body));
    assert.deepEqual(rows, before);
  }
  assert.equal((await request({ title: "Valid task" })).body.id, 2);
});

test("item creation rejects blank titles and trims only surrounding whitespace", async () => {
  const { rows, request } = fixture();
  for (const title of ["", " ", "\t\r\n", "\u00a0"]) {
    assert.equal((await request({ title })).statusCode, 400);
    assert.equal(rows.length, 1);
  }
  const created = await request({ title: " \t Story  notes \n" });
  assert.equal(created.statusCode, 201);
  assert.deepEqual(created.body, { id: 2, title: "Story  notes", done: false });
});

test("item titles accept 120 characters and reject 121 without consuming IDs", async () => {
  const { rows, request } = fixture();
  const before = structuredClone(rows);
  assert.equal((await request({ title: "a".repeat(121) })).statusCode, 400);
  assert.deepEqual(rows, before);
  const created = await request({ title: " \t" + "a".repeat(120) + "\n" });
  assert.equal(created.statusCode, 201);
  assert.equal(created.body.id, 2);
  assert.equal(created.body.title.length, 120);
});

test("item title limits count astral Unicode code points like PostgreSQL", async () => {
  const { rows, request } = fixture();
  const symbol = "\u{1f600}";
  assert.equal((await request({ title: symbol.repeat(121) })).statusCode, 400);
  assert.equal(rows.length, 1);
  const created = await request({ title: symbol.repeat(120) });
  assert.equal(created.statusCode, 201);
  assert.equal(created.body.title.length, 240);
  assert.equal(Array.from(created.body.title).length, 120);
});

test("combining sequences retain PostgreSQL character semantics", async () => {
  const { rows, request } = fixture();
  const combiningSequence = "e\u0301";
  assert.equal((await request({ title: combiningSequence.repeat(61) })).statusCode, 400);
  assert.equal(rows.length, 1);
  const created = await request({ title: combiningSequence.repeat(60) });
  assert.equal(created.statusCode, 201);
  assert.equal(created.body.title, combiningSequence.repeat(60));
});

test("valid item persistence failures still reach the Express error middleware", async () => {
  const failure = new Error("Fixture persistence unavailable");
  const handler = createAddItemHandler(async () => {
    throw failure;
  });
  const res = response();
  let forwarded;
  await handler({ body: { title: "Valid task" } }, res, error => {
    forwarded = error;
  });
  assert.equal(forwarded, failure);
  assert.equal(res.body, undefined);
});
