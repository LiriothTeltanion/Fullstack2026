import { configureStore } from "@reduxjs/toolkit";
import boardReducer from "../features/board/boardSlice.js";
import { loadBoard, persistBoard } from "./persist.js";

const saved = loadBoard();

export const store = configureStore({
  reducer: { board: boardReducer },
  preloadedState: saved ? { board: saved } : undefined,
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(persistBoard),
});
