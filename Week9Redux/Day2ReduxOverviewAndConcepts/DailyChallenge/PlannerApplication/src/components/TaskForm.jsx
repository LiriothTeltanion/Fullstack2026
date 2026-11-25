import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTask, selectSelectedDay } from "../redux/plannerReducer.js";

export default function TaskForm() {
  const day = useSelector(selectSelectedDay);
  const dispatch = useDispatch();
  const [text, setText] = useState("");

  const handleSubmit = event => {
    event.preventDefault();
    if (!text.trim()) return;
    dispatch(addTask(day, text.trim()));
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
