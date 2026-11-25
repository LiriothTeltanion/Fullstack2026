import { configureStore } from "@reduxjs/toolkit";
import plannerReducer from "./plannerReducer.js";

export const store = configureStore({
  reducer: { planner: plannerReducer },
});
