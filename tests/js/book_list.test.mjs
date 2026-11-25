import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const source = fs.readFileSync(
  path.join(
    root,
    "Week10AdvancedTypeScriptAndAuthentication/Day1UsingTypeScriptWithReact/DailyChallenge/BookList/src/books.ts"
  ),
  "utf8"
);
const output = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
});
const exports = {};
new Function("exports", output.outputText)(exports);
const { initialBooks, appendBook } = exports;

test("book records preload title, author and unique IDs", () => {
  assert.equal(initialBooks.length, 3);
  assert.equal(new Set(initialBooks.map(book => book.id)).size, 3);
  for (const book of initialBooks) {
    assert.equal(typeof book.id, "number");
    assert.ok(book.title);
    assert.ok(book.author);
  }
});

test("additions retain existing records and avoid collisions across gaps", () => {
  const before = [
    { id: 10, title: "First", author: "One" },
    { id: 2, title: "Second", author: "Two" },
  ];
  const first = appendBook(before, "  New title  ", "  New author  ");
  const second = appendBook(first, "Another title", "Another author");
  assert.equal(before.length, 2);
  assert.equal(first[2].id, 11);
  assert.equal(second[3].id, 12);
  assert.equal(first[2].title, "New title");
  assert.equal(first[2].author, "New author");
  assert.equal(appendBook([], "New", "Writer")[0].id, 1);
});

test("blank fields are rejected before creating a book", () => {
  assert.throws(() => appendBook(initialBooks, " ", "Writer"), /both/);
  assert.throws(() => appendBook(initialBooks, "Title", "\t"), /both/);
});
