import { memo } from "react";

// memo: the row only re-renders when its own task or handlers change.
function TaskItem({ task, categoryName, onToggle, onEdit, onDelete }) {
  return (
    <li>
      <label className={task.done ? "done" : ""}>
        <input type="checkbox" checked={task.done} onChange={() => onToggle(task.id)} />{" "}
        {task.title} <span className="muted">({categoryName})</span>
      </label>
      <span className="row">
        <button className="secondary" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button className="danger" onClick={() => onDelete(task.id)}>
          Delete
        </button>
      </span>
    </li>
  );
}

export default memo(TaskItem);
