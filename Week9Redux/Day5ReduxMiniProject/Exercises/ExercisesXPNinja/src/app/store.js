import { configureStore } from "@reduxjs/toolkit";
import boardReducer from "../features/board/boardSlice.js";
import { loadBoard, persistBoard, saveFailedReducer } from "./persist.js";

const saved = loadBoard();

export const store = configureStore({
  reducer: { board: boardReducer, saveFailed: saveFailedReducer },
  preloadedState: saved ? { board: saved } : undefined,
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(persistBoard),
});
