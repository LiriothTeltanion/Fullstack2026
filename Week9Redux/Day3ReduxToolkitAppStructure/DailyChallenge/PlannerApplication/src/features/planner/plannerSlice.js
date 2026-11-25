import { createSlice, nanoid } from "@reduxjs/toolkit";
import { toDayKey } from "./dates.js";

const plannerSlice = createSlice({
  name: "planner",
  initialState: { selectedDay: toDayKey(new Date()), tasksByDay: {} },
  reducers: {
    daySelected(state, action) {
      state.selectedDay = action.payload;
    },
    taskAdded: {
      reducer(state, action) {
        const { day, task } = action.payload;
        state.tasksByDay[day] ??= [];
        state.tasksByDay[day].push(task);
      },
      prepare(day, text, time) {
        return { payload: { day, task: { id: nanoid(), text, time, done: false } } };
      },
    },
    taskUpdated(state, action) {
      const { day, id, changes } = action.payload;
      const task = state.tasksByDay[day]?.find(item => item.id === id);
      if (task) Object.assign(task, changes);
    },
    taskDeleted(state, action) {
      const { day, id } = action.payload;
      state.tasksByDay[day] = (state.tasksByDay[day] ?? []).filter(item => item.id !== id);
      if (state.tasksByDay[day].length === 0) delete state.tasksByDay[day];
    },
  },
});

export const { daySelected, taskAdded, taskUpdated, taskDeleted } = plannerSlice.actions;
export default plannerSlice.reducer;

const EMPTY = [];
export const selectSelectedDay = state => state.planner.selectedDay;
export const selectTasksForDay = (state, day) => state.planner.tasksByDay[day] ?? EMPTY;

// Tasks with a time come first, in time order; tasks without a time go last.
export const sortByTime = tasks =>
  [...tasks].sort((a, b) => (a.time || "99:99").localeCompare(b.time || "99:99"));
