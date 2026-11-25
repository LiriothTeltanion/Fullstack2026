import { configureStore } from "@reduxjs/toolkit";
import quizReducer from "../features/quiz/quizSlice.js";

export const store = configureStore({
  reducer: { quiz: quizReducer },
});
