import { configureStore } from "@reduxjs/toolkit";
import books from "../features/books/inventory.js";
import expensesReducer from "../features/expenses/expensesSlice.js";

export const store = configureStore({
  reducer: { books, expenses: expensesReducer },
});
