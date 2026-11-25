import { configureStore } from "@reduxjs/toolkit";
import todosReducer from "../features/todos/todosSlice.js";

export const store = configureStore({
  reducer: { todos: todosReducer },
});
