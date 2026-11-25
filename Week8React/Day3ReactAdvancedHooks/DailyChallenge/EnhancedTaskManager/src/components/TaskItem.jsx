import { useEffect, useRef, useState } from "react";
import { useTasks } from "../context/TaskContext.jsx";

function TaskItem({ task }) {
  const { dispatch } = useTasks();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.text);
  const editRef = useRef(null);

  // When edit mode opens, put the cursor in the edit box.
  useEffect(() => {
    if (editing) editRef.current.focus();
  }, [editing]);

  const save = () => {
    const text = draft.trim();
    if (text) dispatch({ type: "EDIT_TASK", id: task.id, text });
    else setDraft(task.text);
    setEditing(false);
  };

  const handleKey = event => {
    if (event.key === "Enter") save();
    if (event.key === "Escape") {
      setDraft(task.text);
      setEditing(false);
    }
  };

  return (
    <li className={task.completed ? "task done" : "task"}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => dispatch({ type: "TOGGLE_TASK", id: task.id })}
        aria-label={`Mark ${task.text} as done`}
      />
      {editing ? (
        <input
          ref={editRef}
          className="edit"
          value={draft}
          onChange={event => setDraft(event.target.value)}
          onBlur={save}
          onKeyDown={handleKey}
        />
      ) : (
        <span className="text" onDoubleClick={() => setEditing(true)}>
          {task.text}
        </span>
      )}
      <button className="chip" onClick={() => setEditing(true)} disabled={editing}>
        Edit
      </button>
      <button className="chip" onClick={() => dispatch({ type: "DELETE_TASK", id: task.id })}>
        Delete
      </button>
    </li>
  );
}

export default TaskItem;
