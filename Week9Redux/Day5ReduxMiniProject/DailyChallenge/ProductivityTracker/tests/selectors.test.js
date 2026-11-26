import assert from "node:assert/strict";
import test from "node:test";
import { configureStore } from "@reduxjs/toolkit";
import categoriesReducer, {
  categoryAdded,
  categoryDeleted,
  categoryEdited,
  categorySelected,
  selectCategoryById,
} from "../src/features/categories/categoriesSlice.js";
import tasksReducer, * as tasks from "../src/features/tasks/tasksSlice.js";

const newStore = () =>
  configureStore({ reducer: { categories: categoriesReducer, tasks: tasksReducer } });

test("the named completed selector returns a count and follows category selection", () => {
  const store = newStore();
  assert.equal(tasks.selectCompletedTasks(store.getState()), 1);
  assert.equal(tasks.selectCompletedCount(store.getState()), 1);
  store.dispatch(categorySelected("study"));
  assert.equal(tasks.selectCompletedTasks(store.getState()), 0);
  assert.equal(tasks.selectCompletedTasks(store.getState(), "work"), 1);
  store.dispatch(tasks.taskToggled("t2"));
  assert.equal(tasks.selectCompletedTasks(store.getState()), 1);
});

test("completed item selection remains available as a memoized array", () => {
  const store = newStore();
  const first = tasks.selectCompletedTaskItems(store.getState());
  assert.deepEqual(
    first.map(task => task.id),
    ["t1"]
  );
  assert.equal(tasks.selectCompletedTaskItems(store.getState()), first);
  assert.equal(tasks.selectCompletedCount, tasks.selectCompletedTasks);
});

test("category and task CRUD preserve counts, prior state and uncategorized tasks", () => {
  const store = newStore();
  store.dispatch(categoryAdded("Practice"));
  const id = store.getState().categories.items.at(-1).id;
  store.dispatch(categorySelected(id));
  store.dispatch(tasks.taskAdded("Practice selectors", id));
  const task = tasks.selectTasksByCategory(store.getState())[0];
  const before = store.getState();
  store.dispatch(tasks.taskEdited({ id: task.id, title: "Explain selectors" }));
  store.dispatch(tasks.taskToggled(task.id));
  store.dispatch(categoryEdited({ id, name: "Learning" }));
  assert.equal(selectCategoryById(store.getState()).name, "Learning");
  assert.equal(tasks.selectCompletedTasks(store.getState()), 1);
  assert.equal(before.tasks.at(-1).title, "Practice selectors");
  store.dispatch(categoryDeleted(id));
  assert.equal(store.getState().categories.selectedId, "all");
  assert.equal(
    tasks.selectTasksByCategory(store.getState(), "uncategorized")[0].title,
    "Explain selectors"
  );
  assert.equal(tasks.selectCompletedTasks(store.getState(), "uncategorized"), 1);
  store.dispatch(tasks.taskDeleted(task.id));
  assert.equal(tasks.selectCompletedTasks(store.getState(), "uncategorized"), 0);
});
