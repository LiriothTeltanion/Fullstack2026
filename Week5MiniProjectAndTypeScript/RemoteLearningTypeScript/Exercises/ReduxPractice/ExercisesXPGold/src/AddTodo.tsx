import { useState, type FormEvent } from "react";
import { useAppDispatch } from "../../app/hooks";
import { addTodo, today, validDate } from "./todoSlice";
export default function AddTodo() {
  const dispatch = useAppDispatch(),
    [title, setTitle] = useState(""),
    [dueDate, setDueDate] = useState(today()),
    [error, setError] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Native date controls may change without a React change event. Read the
    // actual submitted fields rather than trusting the last rendered state.
    const fields = new FormData(event.currentTarget);
    const enteredTitle = String(fields.get("title") ?? "").trim();
    const enteredDue = String(fields.get("dueDate") ?? "");
    if (!enteredTitle || !validDate(enteredDue)) {
      setError("Enter a title and a valid due date.");
      return;
    }
    dispatch(
      addTodo({
        id: crypto.randomUUID(),
        title: enteredTitle,
        dueDate: enteredDue,
        completed: false,
        createdAt: new Date().toISOString(),
      })
    );
    setTitle("");
    setDueDate(enteredDue);
    setError("");
  }
  return (
    <form onSubmit={submit} className="panel form" aria-label="Add a task">
      <h2>Add a task</h2>
      <label>
        Task title
        <input
          name="title"
          value={title}
          maxLength={200}
          onChange={e => setTitle(e.target.value)}
        />
      </label>
      <label>
        Due date
        <input
          name="dueDate"
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
        />
      </label>
      <button>Add task</button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}
