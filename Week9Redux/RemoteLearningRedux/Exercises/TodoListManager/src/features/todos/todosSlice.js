import { createSelector, createSlice, nanoid } from "@reduxjs/toolkit";

export const FILTERS = ["all", "active", "completed"];

const todosSlice = createSlice({
  name: "todos",
  initialState: { items: [], filter: "all" },
  reducers: {
    todoAdded: {
      reducer(state, action) {
        state.items.push(action.payload);
      },
      prepare(text) {
        return { payload: { id: nanoid(), text, completed: false } };
      },
    },
    todoToggled(state, action) {
      const todo = state.items.find(item => item.id === action.payload);
      if (todo) todo.completed = !todo.completed;
    },
    todoEdited(state, action) {
      const todo = state.items.find(item => item.id === action.payload.id);
      if (todo) todo.text = action.payload.text;
    },
    todoDeleted(state, action) {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    allToggled(state) {
      const allDone = state.items.every(item => item.completed);
      state.items.forEach(item => {
        item.completed = !allDone;
      });
    },
    completedCleared(state) {
      state.items = state.items.filter(item => !item.completed);
    },
    filterChanged(state, action) {
      state.filter = action.payload;
    },
  },
});

export const {
  todoAdded,
  todoToggled,
  todoEdited,
  todoDeleted,
  allToggled,
  completedCleared,
  filterChanged,
} = todosSlice.actions;
export default todosSlice.reducer;

const selectItems = state => state.todos.items;
export const selectFilter = state => state.todos.filter;

export const selectVisibleTodos = createSelector([selectItems, selectFilter], (items, filter) => {
  if (filter === "active") return items.filter(item => !item.completed);
  if (filter === "completed") return items.filter(item => item.completed);
  return items;
});

export const selectCounts = createSelector([selectItems], items => {
  const completed = items.filter(item => item.completed).length;
  return { total: items.length, completed, active: items.length - completed };
});
