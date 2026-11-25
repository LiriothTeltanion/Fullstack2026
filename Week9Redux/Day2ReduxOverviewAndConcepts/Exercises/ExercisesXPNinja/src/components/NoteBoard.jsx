import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNote, deleteNote } from "../redux/notesReducer.js";
import { redo, undo } from "../redux/undoable.js";

export default function NoteBoard() {
  const { past, present, future } = useSelector(state => state.notes);
  const dispatch = useDispatch();
  const [text, setText] = useState("");

  const handleSubmit = event => {
    event.preventDefault();
    if (!text.trim()) return;
    dispatch(addNote(text.trim()));
    setText("");
  };

  return (
    <section className="card">
      <form className="row" onSubmit={handleSubmit}>
        <input
          value={text}
          onChange={event => setText(event.target.value)}
          placeholder="Write a note"
          aria-label="Note text"
        />
        <button type="submit">Add note</button>
        <button
          type="button"
          className="secondary"
          onClick={() => dispatch(undo())}
          disabled={!past.length}
        >
          Undo
        </button>
        <button
          type="button"
          className="secondary"
          onClick={() => dispatch(redo())}
          disabled={!future.length}
        >
          Redo
        </button>
      </form>
      <p className="muted">
        {past.length} step(s) to undo, {future.length} to redo.
      </p>
      <ul className="plain">
        {present.map(note => (
          <li key={note.id}>
            <span className="note">{note.text}</span>
            <button className="danger" onClick={() => dispatch(deleteNote(note.id))}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
