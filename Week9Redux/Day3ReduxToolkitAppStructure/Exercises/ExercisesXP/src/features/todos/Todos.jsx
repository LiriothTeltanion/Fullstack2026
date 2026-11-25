import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTodo, removeTodo, selectRemaining, selectTodos, toggleTodo } from "./todosSlice.js";

export default function Todos() {
  const todos = useSelector(selectTodos);
  const remaining = useSelector(selectRemaining);
  const dispatch = useDispatch();
  const [text, setText] = useState("");

  const handleSubmit = event => {
    event.preventDefault();
    if (!text.trim()) return;
    dispatch(addTodo(text.trim()));
    setText("");
  };

  return (
    <section className="card">
      <h2>Todos slice</h2>
      <form className="row" onSubmit={handleSubmit}>
        <input value={text} onChange={event => setText(event.target.value)} aria-label="New todo" />
        <button type="submit">Add</button>
      </form>
      <p className="muted">{remaining} left to do</p>
      <ul className="plain">
        {todos.map(todo => (
          <li key={todo.id}>
            <label className={todo.completed ? "done" : ""}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => dispatch(toggleTodo(todo.id))}
              />{" "}
              {todo.text}
            </label>
            <button className="danger" onClick={() => dispatch(removeTodo(todo.id))}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
