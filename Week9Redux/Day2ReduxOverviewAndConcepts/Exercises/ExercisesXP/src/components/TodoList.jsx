import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTodo, removeTodo, toggleTodo } from "../redux/actions.js";

export default function TodoList() {
  const todos = useSelector(state => state.todos);
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
      <h2>Todo list</h2>
      <form className="row" onSubmit={handleSubmit}>
        <input
          value={text}
          onChange={event => setText(event.target.value)}
          placeholder="What do you need to do?"
          aria-label="New todo"
        />
        <button type="submit">Add</button>
      </form>
      {todos.length === 0 && <p className="muted">No todos yet.</p>}
      <ul className="plain">
        {todos.map(todo => (
          <li key={todo.id}>
            <label className={todo.done ? "done" : ""}>
              <input
                type="checkbox"
                checked={todo.done}
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
