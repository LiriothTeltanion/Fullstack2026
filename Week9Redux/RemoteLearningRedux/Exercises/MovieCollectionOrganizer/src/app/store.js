import { configureStore } from "@reduxjs/toolkit";
import filtersReducer from "../features/filters/filtersSlice.js";
import moviesReducer from "../features/movies/moviesSlice.js";

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    filters: filtersReducer,
  },
});
