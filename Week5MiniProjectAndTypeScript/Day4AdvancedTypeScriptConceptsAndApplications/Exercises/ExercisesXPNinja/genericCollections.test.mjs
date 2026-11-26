import assert from "node:assert/strict";
import test from "node:test";
import { Container, parseResponse, Repository } from "./genericCollections.ts";

test("Container adds, lists and removes intersection-shaped items", () => {
  const collection = new Container();
  const first = { name: "Example", id: 1 };
  const second = { name: "Another", id: 2 };
  collection.add(first);
  collection.add(second);
  const snapshot = collection.list();
  snapshot.pop();
  assert.deepEqual(collection.list(), [first, second]);
  assert.equal(collection.remove(first), true);
  assert.equal(collection.remove(first), false);
  assert.deepEqual(collection.list(), [second]);
});

test("parseResponse returns the decoded payload without changing the response", () => {
  const response = { status: 200, data: Object.freeze({ id: 1, name: "Example" }) };
  assert.equal(parseResponse(response), response.data);
  assert.equal(parseResponse({ status: 200, data: [1, 2] }).length, 2);
  assert.equal(parseResponse({ status: 204, data: null }), null);
  assert.equal(response.status, 200);
});

test("Repository retrieves typed values and handles empty or invalid positions", () => {
  const repository = new Repository();
  assert.equal(repository.retrieve(0), undefined);
  repository.add("first");
  repository.add("second");
  assert.equal(repository.retrieve(0), "first");
  for (const index of [-1, 0.5, NaN, 4]) assert.equal(repository.retrieve(index), undefined);
  repository.list().splice(0);
  assert.deepEqual(repository.list(), ["first", "second"]);
  const objects = new Repository();
  objects.add({ id: 1 });
  assert.deepEqual(objects.retrieve(0), { id: 1 });
});
