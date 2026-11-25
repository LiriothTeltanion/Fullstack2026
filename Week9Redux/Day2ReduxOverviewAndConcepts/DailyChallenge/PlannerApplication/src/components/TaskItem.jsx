import { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteTask, editTask, toggleTask } from "../redux/plannerReducer.js";

export default function TaskItem({ day, task }) {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(task.text);

  const save = () => {
    if (draft.trim()) dispatch(editTask(day, task.id, draft.trim()));
    setIsEditing(false);
  };

  return (
    <li>
      {isEditing ? (
        <input
          value={draft}
          onChange={event => setDraft(event.target.value)}
          onKeyDown={event => event.key === "Enter" && save()}
          aria-label="Edit task"
          autoFocus
        />
      ) : (
        <label className={task.done ? "done" : ""}>
          <input
            type="checkbox"
            checked={task.done}
            onChange={() => dispatch(toggleTask(day, task.id))}
          />{" "}
          {task.text}
        </label>
      )}
      <span className="row">
        {isEditing ? (
          <button onClick={save}>Save</button>
        ) : (
          <button className="secondary" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        )}
        <button className="danger" onClick={() => dispatch(deleteTask(day, task.id))}>
          Delete
        </button>
      </span>
    </li>
  );
}
