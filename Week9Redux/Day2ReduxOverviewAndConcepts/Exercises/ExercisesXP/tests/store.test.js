import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  addTodo,
  decrement,
  increment,
  removeTodo,
  reset,
  toggleTodo,
} from "../src/redux/actions.js";
import { store } from "../src/redux/store.js";

test("the introductory store uses the classic Redux createStore API", async () => {
  const source = await readFile(new URL("../src/redux/store.js", import.meta.url), "utf8");
  assert.match(source, /import\s*\{[^}]*\bcreateStore\b[^}]*\}\s*from\s*["']redux["']/);
  assert.match(source, /\bcreateStore\s*\(/);
});

test("counter, todo CRUD and bounded history share an immutable store", () => {
  assert.deepEqual(store.getState(), { counter: { value: 0 }, todos: [], history: [] });
  const initial = store.getState();
  store.dispatch(increment());
  store.dispatch(increment());
  store.dispatch(decrement());
  assert.equal(store.getState().counter.value, 1);
  assert.equal(initial.counter.value, 0);
  store.dispatch(reset());
  assert.equal(store.getState().counter.value, 0);

  store.dispatch(addTodo("Read the Redux example"));
  const afterAdd = store.getState();
  const id = afterAdd.todos[0].id;
  store.dispatch(toggleTodo(id));
  assert.equal(store.getState().todos[0].done, true);
  assert.equal(afterAdd.todos[0].done, false);
  store.dispatch(removeTodo(id));
  assert.deepEqual(store.getState().todos, []);
  assert.equal(store.getState().history.length, 5);
  assert.equal(store.getState().history[0], "todos/remove");
  assert.ok(store.getState().history.every(type => !type.startsWith("@@")));
});
