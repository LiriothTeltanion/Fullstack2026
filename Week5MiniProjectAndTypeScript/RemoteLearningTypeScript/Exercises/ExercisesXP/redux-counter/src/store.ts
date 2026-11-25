import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counterSlice";

// A factory also gives each test an independent state tree.
export function createAppStore() {
  return configureStore({ reducer: { counter: counterReducer } });
}

export const store = createAppStore();
export type AppStore = ReturnType<typeof createAppStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
