import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counterReducer.js";
import historyReducer from "./historyReducer.js";
import todosReducer from "./todosReducer.js";

// Each key becomes one part of the state: state.counter, state.todos, state.history.
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    todos: todosReducer,
    history: historyReducer,
  },
});
