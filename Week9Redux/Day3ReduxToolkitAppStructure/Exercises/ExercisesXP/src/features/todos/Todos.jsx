import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTodo, removeTodo, selectRemaining, selectTodos, toggleTodo } from "./todosSlice.js";

function AddTodo() {
  const dispatch = useDispatch();
  const [text, setText] = useState("");

  const handleSubmit = event => {
    event.preventDefault();
    if (!text.trim()) return;
    dispatch(addTodo(text.trim()));
    setText("");
  };

  return (
    <form className="row" onSubmit={handleSubmit}>
      <input value={text} onChange={event => setText(event.target.value)} aria-label="New todo" />
      <button type="submit">Add</button>
    </form>
  );
}

function TodoItem({ todo }) {
  const dispatch = useDispatch();
  return (
    <li>
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
  );
}

export default function TodoList() {
  const todos = useSelector(selectTodos);
  const remaining = useSelector(selectRemaining);
  return (
    <section className="card">
      <h2>Todos slice</h2>
      <AddTodo />
      <p className="muted">{remaining} left to do</p>
      <ul className="plain">
        {todos.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </section>
  );
}
