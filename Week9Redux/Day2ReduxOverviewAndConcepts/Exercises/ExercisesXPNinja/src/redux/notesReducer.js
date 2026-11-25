const ADD_NOTE = "notes/add";
const DELETE_NOTE = "notes/delete";

export const addNote = text => ({
  type: ADD_NOTE,
  payload: { id: Date.now(), text },
});
export const deleteNote = id => ({ type: DELETE_NOTE, payload: id });

export default function notesReducer(state = [], action) {
  switch (action.type) {
    case ADD_NOTE:
      return [...state, action.payload];
    case DELETE_NOTE:
      return state.filter(note => note.id !== action.payload);
    default:
      return state;
  }
}
