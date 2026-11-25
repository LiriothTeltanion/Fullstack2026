import { useEffect, useRef, useState } from "react";
import { useTasks } from "../context/TaskContext.jsx";

function TaskForm() {
  const { dispatch } = useTasks();
  const [text, setText] = useState("");
  const inputRef = useRef(null);

  // Focus the input when the page opens.
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleSubmit = event => {
    event.preventDefault();
    if (!text.trim()) return;
    dispatch({ type: "ADD_TASK", text: text.trim() });
    setText("");
    inputRef.current.focus();
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        value={text}
        onChange={event => setText(event.target.value)}
        placeholder="What needs to be done?"
        aria-label="New task"
      />
      <button type="submit">Add</button>
    </form>
  );
}

export default TaskForm;
