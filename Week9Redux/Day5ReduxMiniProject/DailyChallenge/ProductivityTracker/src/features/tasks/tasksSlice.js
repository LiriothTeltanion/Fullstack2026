import { createSelector, createSlice, nanoid } from "@reduxjs/toolkit";
import { selectCategories, selectSelectedCategoryId } from "../categories/categoriesSlice.js";

const tasksSlice = createSlice({
  name: "tasks",
  initialState: [
    { id: "t1", title: "Reply to emails", categoryId: "work", done: true },
    { id: "t2", title: "Read the Redux docs", categoryId: "study", done: false },
    { id: "t3", title: "30 minute walk", categoryId: "health", done: false },
  ],
  reducers: {
    taskAdded: {
      reducer(state, action) {
        state.push(action.payload);
      },
      prepare(title, categoryId) {
        return { payload: { id: nanoid(), title, categoryId, done: false } };
      },
    },
    taskToggled(state, action) {
      const task = state.find(item => item.id === action.payload);
      if (task) task.done = !task.done;
    },
    taskEdited(state, action) {
      const task = state.find(item => item.id === action.payload.id);
      if (task) task.title = action.payload.title;
    },
    taskDeleted(state, action) {
      return state.filter(item => item.id !== action.payload);
    },
  },
});

export const { taskAdded, taskToggled, taskEdited, taskDeleted } = tasksSlice.actions;
export default tasksSlice.reducer;

const selectTasks = state => state.tasks;

export const selectVisibleTasks = createSelector(
  [selectTasks, selectSelectedCategoryId],
  (tasks, categoryId) =>
    categoryId === "all" ? tasks : tasks.filter(task => task.categoryId === categoryId)
);

export const selectCompletedCount = createSelector(
  [selectVisibleTasks],
  tasks => tasks.filter(task => task.done).length
);

// One row per category: { id, name, total, done, percent }
export const selectProgressByCategory = createSelector(
  [selectCategories, selectTasks],
  (categories, tasks) =>
    categories.map(category => {
      const own = tasks.filter(task => task.categoryId === category.id);
      const done = own.filter(task => task.done).length;
      return {
        ...category,
        total: own.length,
        done,
        percent: own.length ? Math.round((done / own.length) * 100) : 0,
      };
    })
);
