import { configureStore } from "@reduxjs/toolkit";
import recipesReducer from "./recipesSlice";

export function createAppStore() {
  return configureStore({ reducer: { recipes: recipesReducer } });
}

export type AppStore = ReturnType<typeof createAppStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
