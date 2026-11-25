import { ADD_TODO, DECREMENT, INCREMENT, REMOVE_TODO, RESET, TOGGLE_TODO } from "./actionTypes.js";

// Action creators: small functions that return a plain action object.
export const increment = () => ({ type: INCREMENT });
export const decrement = () => ({ type: DECREMENT });
export const reset = () => ({ type: RESET });

let nextTodoId = 1;

export const addTodo = text => ({
  type: ADD_TODO,
  payload: { id: nextTodoId++, text },
});
export const toggleTodo = id => ({ type: TOGGLE_TODO, payload: id });
export const removeTodo = id => ({ type: REMOVE_TODO, payload: id });
