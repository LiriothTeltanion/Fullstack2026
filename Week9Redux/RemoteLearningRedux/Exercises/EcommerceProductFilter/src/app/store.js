import { configureStore } from "@reduxjs/toolkit";
import filtersReducer from "../features/filters/filtersSlice.js";
import productsReducer from "../features/products/productsSlice.js";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    filters: filtersReducer,
  },
});
