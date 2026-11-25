import { configureStore } from "@reduxjs/toolkit";
import plannerReducer from "../features/planner/plannerSlice.js";
import { loadState, saveState } from "./storage.js";

const saved = loadState();

export const store = configureStore({
  reducer: { planner: plannerReducer },
  preloadedState: saved ? { planner: saved } : undefined,
});

store.subscribe(() => saveState(store.getState().planner));
