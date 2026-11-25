import { configureStore } from "@reduxjs/toolkit";
import { todosApi } from "../features/todos/todosApi.js";

export const store = configureStore({
  reducer: {
    [todosApi.reducerPath]: todosApi.reducer,
  },
  // The API middleware handles caching, refetching and cache lifetimes.
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(todosApi.middleware),
});
