import test from "node:test";
import assert from "node:assert/strict";

let moduleId = 0;
async function controllers(name) {
  // Each case receives fresh seed arrays without exposing implementation state.
  return import(`../controllers/${name}Controller.js?case=${moduleId++}`);
}

function response() {
  return {
    statusCode: 200,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = structuredClone(body);
      return this;
    },
    end() {
      this.ended = true;
      return this;
    },
  };
}

function call(handler, body, id) {
  const res = response();
  handler({ body, params: { id: String(id) } }, res);
  return res;
}

function snapshot(handler) {
  return call(handler).body;
}

test("todo CRUD preserves JSON booleans and the existing response shapes", async () => {
  const todo = await controllers("todos");
  const created = call(todo.addTodo, { title: "  Practice routes  " });
  assert.equal(created.statusCode, 201);
  assert.deepEqual(created.body, { id: 3, title: "Practice routes", completed: false });
  assert.equal(snapshot(todo.getTodos).length, 3);
  assert.deepEqual(call(todo.updateTodo, { completed: true }, 3).body, {
    id: 3,
    title: "Practice routes",
    completed: true,
  });
  assert.equal(
    call(todo.updateTodo, { completed: false, title: " Review " }, 3).body.completed,
    false
  );
  assert.equal(call(todo.updateTodo, { title: " Review " }, 3).body.title, "Review");
  const removed = call(todo.deleteTodo, undefined, 3);
  assert.equal(removed.statusCode, 200);
  assert.equal(removed.body.todo.id, 3);
  assert.equal(snapshot(todo.getTodos).length, 2);
  assert.equal(call(todo.updateTodo, { title: "Missing" }, 999).statusCode, 404);
  assert.equal(call(todo.deleteTodo, undefined, 999).statusCode, 404);
});

test("todo rejects invalid bodies and titles without creating records or consuming IDs", async () => {
  const todo = await controllers("todos");
  const before = snapshot(todo.getTodos);
  const invalidBodies = [
    undefined,
    null,
    [],
    "text",
    42,
    true,
    {},
    { title: "" },
    { title: "   " },
    { title: null },
    { title: [] },
    { title: {} },
    { title: 1 },
  ];
  for (const body of invalidBodies) {
    assert.equal(call(todo.addTodo, body).statusCode, 400, JSON.stringify(body));
    assert.deepEqual(snapshot(todo.getTodos), before);
  }
  assert.equal(call(todo.addTodo, { title: "Valid" }).body.id, 3);
});

test("todo rejects incorrect completed types atomically instead of coercing strings", async () => {
  const todo = await controllers("todos");
  const before = snapshot(todo.getTodos);
  for (const completed of ["false", "true", 0, 1, null, [], {}]) {
    const body = { title: "Must not be saved", completed };
    assert.equal(call(todo.updateTodo, body, 1).statusCode, 400);
    assert.equal(call(todo.addTodo, body).statusCode, 400);
    assert.deepEqual(snapshot(todo.getTodos), before);
  }
  for (const body of [undefined, null, [], {}, { unknown: true }, { title: " " }]) {
    assert.equal(call(todo.updateTodo, body, 1).statusCode, 400);
    assert.deepEqual(snapshot(todo.getTodos), before);
  }
});

test("book CRUD supports omitted, zero, numeric-string and null years", async () => {
  const books = await controllers("books");
  const created = call(books.addBook, { title: "  A book  ", author: " Author " });
  assert.equal(created.statusCode, 201);
  assert.deepEqual(created.body, { id: 3, title: "A book", author: "Author", year: null });
  assert.deepEqual(call(books.getBookById, undefined, 3).body, created.body);
  assert.equal(call(books.updateBook, { year: 0 }, 3).body.year, 0);
  assert.equal(call(books.updateBook, { year: " 1937 " }, 3).body.year, 1937);
  assert.equal(call(books.updateBook, { year: null }, 3).body.year, null);
  assert.equal(
    call(books.updateBook, { title: " Revised ", author: " New author " }, 3).body.title,
    "Revised"
  );
  assert.equal(call(books.addBook, { title: "Zero", author: "Author", year: 0 }).body.year, 0);
  const removed = call(books.deleteBook, undefined, 3);
  assert.equal(removed.statusCode, 204);
  assert.equal(removed.ended, true);
  assert.equal(call(books.getBookById, undefined, 3).statusCode, 404);
  assert.equal(call(books.updateBook, { title: "Missing" }, 999).statusCode, 404);
  assert.equal(call(books.deleteBook, undefined, 999).statusCode, 404);
});

test("books reject absent bodies and invalid text without creating records", async () => {
  const books = await controllers("books");
  const before = snapshot(books.getBooks);
  const invalidBodies = [
    undefined,
    null,
    [],
    "text",
    42,
    true,
    {},
    { title: "Title" },
    { author: "Author" },
    { title: {}, author: "Author" },
    { title: "Title", author: [] },
    { title: " ", author: "Author" },
    { title: "Title", author: null },
  ];
  for (const body of invalidBodies) {
    assert.equal(call(books.addBook, body).statusCode, 400, JSON.stringify(body));
    assert.deepEqual(snapshot(books.getBooks), before);
  }
  assert.equal(call(books.addBook, { title: "Valid", author: "Author" }).body.id, 3);
});

test("books reject invalid years and mixed updates before changing any field", async () => {
  const books = await controllers("books");
  const before = snapshot(books.getBooks);
  for (const year of [
    "not a year",
    "",
    " ",
    "19e2",
    "1937.5",
    1937.5,
    NaN,
    Infinity,
    true,
    false,
    [],
    {},
    Number.MAX_SAFE_INTEGER + 1,
  ]) {
    const body = { title: "Must not be saved", author: "Author", year };
    assert.equal(call(books.addBook, body).statusCode, 400);
    assert.equal(call(books.updateBook, body, 1).statusCode, 400);
    assert.deepEqual(snapshot(books.getBooks), before);
  }
  for (const body of [
    undefined,
    null,
    [],
    {},
    { unknown: true },
    { title: "Valid", author: {} },
    { title: "", year: 2000 },
  ]) {
    assert.equal(call(books.updateBook, body, 1).statusCode, 400);
    assert.deepEqual(snapshot(books.getBooks), before);
  }
});
