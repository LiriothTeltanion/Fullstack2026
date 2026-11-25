import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectSelectedDay,
  selectTasksForDay,
  sortByTime,
  taskAdded,
  taskDeleted,
  taskUpdated,
} from "./plannerSlice.js";

export default function DayTasks() {
  const day = useSelector(selectSelectedDay);
  const tasks = useSelector(state => selectTasksForDay(state, day));
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const [time, setTime] = useState("");

  const handleSubmit = event => {
    event.preventDefault();
    if (!text.trim()) return;
    dispatch(taskAdded(day, text.trim(), time));
    setText("");
    setTime("");
  };

  const rename = task => {
    const newText = window.prompt("Rename task", task.text);
    if (newText && newText.trim()) {
      dispatch(taskUpdated({ day, id: task.id, changes: { text: newText.trim() } }));
    }
  };

  return (
    <section className="card">
      <h2>Tasks for {day}</h2>
      <form className="row" onSubmit={handleSubmit}>
        <input
          type="time"
          value={time}
          onChange={event => setTime(event.target.value)}
          aria-label="Time"
        />
        <input
          value={text}
          onChange={event => setText(event.target.value)}
          placeholder="What's the plan?"
          aria-label="Task"
        />
        <button type="submit">Add</button>
      </form>
      {tasks.length === 0 && <p className="muted">Free day.</p>}
      <ul className="plain">
        {sortByTime(tasks).map(task => (
          <li key={task.id}>
            <label className={task.done ? "done" : ""}>
              <input
                type="checkbox"
                checked={task.done}
                onChange={() =>
                  dispatch(taskUpdated({ day, id: task.id, changes: { done: !task.done } }))
                }
              />{" "}
              {task.time && <strong>{task.time} </strong>}
              {task.text}
            </label>
            <span className="row">
              <button className="secondary" onClick={() => rename(task)}>
                Edit
              </button>
              <button
                className="danger"
                onClick={() => dispatch(taskDeleted({ day, id: task.id }))}
              >
                Delete
              </button>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
