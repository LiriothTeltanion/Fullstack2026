import { createSlice, nanoid } from "@reduxjs/toolkit";

const todosSlice = createSlice({
  name: "todos",
  initialState: [],
  reducers: {
    addTodo: {
      reducer(state, action) {
        state.push(action.payload);
      },
      // prepare builds the payload, so the component only passes the text
      prepare(text) {
        return { payload: { id: nanoid(), text, completed: false } };
      },
    },
    toggleTodo(state, action) {
      const todo = state.find(item => item.id === action.payload);
      if (todo) todo.completed = !todo.completed;
    },
    removeTodo(state, action) {
      return state.filter(item => item.id !== action.payload);
    },
  },
});

export const { addTodo, toggleTodo, removeTodo } = todosSlice.actions;
export const selectTodos = state => state.todos;
export const selectRemaining = state => state.todos.filter(todo => !todo.completed).length;
export default todosSlice.reducer;
