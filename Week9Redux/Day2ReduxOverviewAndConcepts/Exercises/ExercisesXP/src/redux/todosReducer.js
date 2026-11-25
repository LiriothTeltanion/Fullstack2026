import { ADD_TODO, REMOVE_TODO, TOGGLE_TODO } from "./actionTypes.js";

// The state is never changed in place: each case returns a new array.
export default function todosReducer(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return [...state, { ...action.payload, done: false }];
    case TOGGLE_TODO:
      return state.map(todo => (todo.id === action.payload ? { ...todo, done: !todo.done } : todo));
    case REMOVE_TODO:
      return state.filter(todo => todo.id !== action.payload);
    default:
      return state;
  }
}
