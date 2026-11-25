import { useState } from "react";
import { connect } from "react-redux";
import { addTodo, removeTodo, toggleTodo } from "../redux/actions.js";

function TodoList({ todos, onAdd, onToggle, onRemove }) {
  const [text, setText] = useState("");

  const handleSubmit = event => {
    event.preventDefault();
    if (!text.trim()) return;
    onAdd(text.trim());
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
              <input type="checkbox" checked={todo.done} onChange={() => onToggle(todo.id)} />{" "}
              {todo.text}
            </label>
            <button className="danger" onClick={() => onRemove(todo.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

const mapStateToProps = state => ({ todos: state.todos });
const mapDispatchToProps = { onAdd: addTodo, onToggle: toggleTodo, onRemove: removeTodo };
export default connect(mapStateToProps, mapDispatchToProps)(TodoList);
