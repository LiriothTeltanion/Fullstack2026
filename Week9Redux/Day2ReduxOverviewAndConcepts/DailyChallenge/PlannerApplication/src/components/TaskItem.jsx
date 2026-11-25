import { useState } from "react";
import { connect } from "react-redux";
import { deleteTask, editTask, toggleTask } from "../redux/plannerReducer.js";

export function TaskItem({ day, task, onEditTask, onToggleTask, onDeleteTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(task.text);

  const save = () => {
    if (draft.trim()) onEditTask(day, task.id, draft.trim());
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
          <input type="checkbox" checked={task.done} onChange={() => onToggleTask(day, task.id)} />{" "}
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
        <button className="danger" onClick={() => onDeleteTask(day, task.id)}>
          Delete
        </button>
      </span>
    </li>
  );
}

export default connect(null, {
  onEditTask: editTask,
  onToggleTask: toggleTask,
  onDeleteTask: deleteTask,
})(TaskItem);
