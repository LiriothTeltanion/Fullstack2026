import { configureStore } from "@reduxjs/toolkit";
import booksReducer from "../features/books/booksSlice.js";
import filtersReducer from "../features/filters/filtersSlice.js";

export const store = configureStore({
  reducer: {
    books: booksReducer,
    filters: filtersReducer,
  },
});
