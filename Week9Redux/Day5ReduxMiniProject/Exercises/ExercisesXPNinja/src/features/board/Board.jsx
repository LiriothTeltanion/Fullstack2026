import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import Column from "./Column.jsx";
import { COLUMNS, boardReset, cardAdded } from "./boardSlice.js";

export default function Board() {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  // The receiving column restores focus after React moves the card's controls.
  const focusRequest = useRef(null);

  const handleSubmit = event => {
    event.preventDefault();
    if (!title.trim()) return;
    dispatch(cardAdded(title.trim()));
    setTitle("");
  };

  return (
    <>
      <form className="row card" onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={event => setTitle(event.target.value)}
          placeholder="New card"
          aria-label="New card"
        />
        <button type="submit">Add to "To do"</button>
        <button type="button" className="secondary" onClick={() => dispatch(boardReset())}>
          Reset board
        </button>
      </form>
      <div className="board">
        {COLUMNS.map((column, index) => (
          <Column key={column.id} column={column} index={index} focusRequest={focusRequest} />
        ))}
      </div>
    </>
  );
}
