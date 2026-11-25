import { configureStore } from "@reduxjs/toolkit";
import expensesReducer from "../features/expenses/expensesSlice.js";

export const store = configureStore({
  reducer: { expenses: expensesReducer },
});
