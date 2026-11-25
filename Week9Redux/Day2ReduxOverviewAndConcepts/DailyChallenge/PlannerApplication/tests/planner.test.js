import test from "node:test";
import assert from "node:assert/strict";
import { configureStore } from "@reduxjs/toolkit";
import reducer, {
  selectDay,
  addTask,
  editTask,
  toggleTask,
  deleteTask,
  selectSelectedDay,
  selectTasksForSelectedDay,
} from "../src/redux/plannerReducer.js";

test("CRUD stays scoped to the selected date", () => {
  const store = configureStore({ reducer: { planner: reducer } });
  const first = "2026-11-25";
  const second = "2026-11-26";
  store.dispatch(selectDay(first));
  store.dispatch(addTask(first, "Read"));
  const id = selectTasksForSelectedDay(store.getState())[0].id;
  store.dispatch(selectDay(second));
  assert.deepEqual(selectTasksForSelectedDay(store.getState()), []);
  store.dispatch(addTask(second, "Practice"));
  const previous = store.getState();
  store.dispatch(editTask(first, id, "Read the exercise"));
  store.dispatch(toggleTask(first, id));
  assert.equal(selectSelectedDay(store.getState()), second);
  assert.equal(selectTasksForSelectedDay(store.getState())[0].text, "Practice");
  assert.equal(previous.planner.tasksByDay[first][0].text, "Read");
  store.dispatch(selectDay(first));
  assert.equal(selectTasksForSelectedDay(store.getState())[0].text, "Read the exercise");
  assert.equal(selectTasksForSelectedDay(store.getState())[0].done, true);
  store.dispatch(deleteTask(first, id));
  assert.deepEqual(selectTasksForSelectedDay(store.getState()), []);
  assert.equal(store.getState().planner.tasksByDay[second].length, 1);
});

test("rapid additions have independent ids for later edits and deletes", () => {
  const store = configureStore({ reducer: { planner: reducer } });
  const day = selectSelectedDay(store.getState());
  for (let i = 0; i < 100; i++) store.dispatch(addTask(day, `Task ${i}`));
  const tasks = selectTasksForSelectedDay(store.getState());
  assert.equal(new Set(tasks.map(task => task.id)).size, 100);
  store.dispatch(deleteTask(day, tasks[0].id));
  assert.equal(selectTasksForSelectedDay(store.getState()).length, 99);
});
