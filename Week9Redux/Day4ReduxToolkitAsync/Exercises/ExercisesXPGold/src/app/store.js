import { configureStore } from "@reduxjs/toolkit";
import directoryReducer from "../features/directory/directorySlice.js";

export const store = configureStore({
  reducer: { directory: directoryReducer },
});
