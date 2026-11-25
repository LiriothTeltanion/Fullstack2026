import { useState } from "react";
import { useDispatch } from "react-redux";
import { todoDeleted, todoEdited, todoToggled } from "./todosSlice.js";

export default function TodoItem({ todo }) {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(todo.text);

  const finishEdit = () => {
    const text = draft.trim();
    if (text) dispatch(todoEdited({ id: todo.id, text }));
    else setDraft(todo.text);
    setIsEditing(false);
  };

  const handleKeyDown = event => {
    if (event.key === "Enter") finishEdit();
    if (event.key === "Escape") {
      setDraft(todo.text);
      setIsEditing(false);
    }
  };

  return (
    <li>
      {isEditing ? (
        <input
          value={draft}
          onChange={event => setDraft(event.target.value)}
          onBlur={finishEdit}
          onKeyDown={handleKeyDown}
          aria-label="Edit todo"
          autoFocus
        />
      ) : (
        <label className={todo.completed ? "done" : ""} onDoubleClick={() => setIsEditing(true)}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => dispatch(todoToggled(todo.id))}
          />{" "}
          {todo.text}
        </label>
      )}
      <span className="row">
        <button className="secondary" onClick={() => setIsEditing(true)}>
          Edit
        </button>
        <button className="danger" onClick={() => dispatch(todoDeleted(todo.id))}>
          Delete
        </button>
      </span>
    </li>
  );
}
