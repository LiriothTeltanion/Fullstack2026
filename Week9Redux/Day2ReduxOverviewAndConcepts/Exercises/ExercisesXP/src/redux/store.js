import { combineReducers, createStore } from "redux";
import counterReducer from "./counterReducer.js";
import historyReducer from "./historyReducer.js";
import todosReducer from "./todosReducer.js";

// Each key becomes one part of the state: state.counter, state.todos, state.history.
const rootReducer = combineReducers({
  counter: counterReducer,
  todos: todosReducer,
  history: historyReducer,
});

// This introductory example keeps store creation explicit; later days introduce Toolkit.
export const store = createStore(rootReducer);
