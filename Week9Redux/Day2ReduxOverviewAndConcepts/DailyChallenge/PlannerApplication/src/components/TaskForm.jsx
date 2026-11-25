import { useState } from "react";
import { connect } from "react-redux";
import { addTask, selectSelectedDay } from "../redux/plannerReducer.js";

export function TaskForm({ day, onAddTask }) {
  const [text, setText] = useState("");

  const handleSubmit = event => {
    event.preventDefault();
    if (!text.trim()) return;
    onAddTask(day, text.trim());
    setText("");
  };

  return (
    <form className="row" onSubmit={handleSubmit}>
      <input
        value={text}
        onChange={event => setText(event.target.value)}
        placeholder="New task for this day"
        aria-label="New task"
      />
      <button type="submit">Add task</button>
    </form>
  );
}

export default connect(state => ({ day: selectSelectedDay(state) }), {
  onAddTask: addTask,
})(TaskForm);
