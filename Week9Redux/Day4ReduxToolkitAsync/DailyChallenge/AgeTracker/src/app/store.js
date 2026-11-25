import { configureStore } from "@reduxjs/toolkit";
import ageReducer from "../features/age/ageSlice.js";

export const store = configureStore({
  reducer: { age: ageReducer },
});
