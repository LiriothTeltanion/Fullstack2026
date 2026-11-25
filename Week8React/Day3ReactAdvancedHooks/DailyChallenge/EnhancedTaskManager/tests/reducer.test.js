import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { transform } from "esbuild";

const source = await readFile(new URL("../src/context/TaskContext.jsx", import.meta.url), "utf8");
const { code } = await transform(source, { loader: "jsx", jsx: "automatic", format: "esm" });
const moduleCode = code.replace(
  /from "(react(?:\/jsx-runtime)?)"/g,
  (_, name) => `from ${JSON.stringify(import.meta.resolve(name))}`
);
const { taskReducer } = await import(
  `data:text/javascript;base64,${Buffer.from(moduleCode).toString("base64")}`
);

test("rapid additions stay independently editable and deletable", t => {
  t.mock.method(Date, "now", () => 1000);
  let state = { tasks: [], filter: "all" };
  for (let i = 0; i < 100; i++) state = taskReducer(state, { type: "ADD_TASK", text: `Task ${i}` });
  assert.equal(new Set(state.tasks.map(task => task.id)).size, 100);
  const id = state.tasks[0].id;
  const before = state;
  state = taskReducer(state, { type: "EDIT_TASK", id, text: "Updated" });
  assert.equal(before.tasks[0].text, "Task 0");
  assert.equal(state.tasks[0].text, "Updated");
  state = taskReducer(state, { type: "DELETE_TASK", id });
  assert.equal(state.tasks.length, 99);
});

test("the reducer controls completion and filter while retaining old numeric ids", () => {
  let state = { tasks: [{ id: 42, text: "Older saved task", completed: false }], filter: "all" };
  state = taskReducer(state, { type: "TOGGLE_TASK", id: 42 });
  assert.equal(state.tasks[0].completed, true);
  state = taskReducer(state, { type: "SET_FILTER", filter: "completed" });
  assert.equal(state.filter, "completed");
  state = taskReducer(state, { type: "CLEAR_COMPLETED" });
  assert.deepEqual(state.tasks, []);
});
