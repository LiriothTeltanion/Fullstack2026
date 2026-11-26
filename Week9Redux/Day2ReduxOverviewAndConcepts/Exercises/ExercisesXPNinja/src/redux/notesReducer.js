import { nanoid } from "@reduxjs/toolkit";

const ADD_NOTE = "notes/add";
const DELETE_NOTE = "notes/delete";

export const addNote = text => ({
  type: ADD_NOTE,
  payload: { id: nanoid(), text },
});
export const deleteNote = id => ({ type: DELETE_NOTE, payload: id });

export default function notesReducer(state = [], action) {
  switch (action.type) {
    case ADD_NOTE:
      if (typeof action.payload?.text !== "string" || !action.payload.text.trim()) return state;
      return [...state, action.payload];
    case DELETE_NOTE:
      if (!state.some(note => note.id === action.payload)) return state;
      return state.filter(note => note.id !== action.payload);
    default:
      return state;
  }
}
