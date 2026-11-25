import { createSlice } from "@reduxjs/toolkit";
import { questions } from "../../data/questions.js";

export const SECONDS_PER_QUESTION = 15;

const initialState = {
  current: 0,
  answers: [], // the chosen option index per question, or null when time ran out
  secondsLeft: SECONDS_PER_QUESTION,
  finished: false,
};

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    optionChosen(state, action) {
      if (state.answers[state.current] !== undefined) return; // already answered
      state.answers[state.current] = action.payload;
    },
    nextQuestion(state) {
      if (state.answers[state.current] === undefined) state.answers[state.current] = null;
      if (state.current === questions.length - 1) {
        state.finished = true;
      } else {
        state.current += 1;
        state.secondsLeft = SECONDS_PER_QUESTION;
      }
    },
    tick(state) {
      if (state.finished || state.answers[state.current] !== undefined) return;
      state.secondsLeft -= 1;
      if (state.secondsLeft <= 0) state.answers[state.current] = null; // time's up
    },
    restarted() {
      return initialState;
    },
  },
});

export const { optionChosen, nextQuestion, tick, restarted } = quizSlice.actions;
export default quizSlice.reducer;

export const selectCurrentQuestion = state => questions[state.quiz.current];
export const selectCurrentAnswer = state => state.quiz.answers[state.quiz.current];
export const selectScore = state =>
  state.quiz.answers.filter((choice, index) => choice === questions[index].answer).length;
export const QUESTION_COUNT = questions.length;
