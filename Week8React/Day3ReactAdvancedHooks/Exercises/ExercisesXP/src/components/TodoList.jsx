import { useReducer, useState } from "react";

function todoReducer(todos, action) {
  switch (action.type) {
    case "add":
      return [...todos, { id: crypto.randomUUID(), text: action.text }];
    case "remove":
      return todos.filter(todo => todo.id !== action.id);
    default:
      return todos;
  }
}

function TodoList() {
  const [todos, dispatch] = useReducer(todoReducer, []);
  const [text, setText] = useState("");

  const handleSubmit = event => {
    event.preventDefault();
    if (!text.trim()) return;
    dispatch({ type: "add", text: text.trim() });
    setText("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={text}
          onChange={event => setText(event.target.value)}
          placeholder="New todo"
        />{" "}
        <button type="submit">Add</button>
      </form>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.text}{" "}
            <button onClick={() => dispatch({ type: "remove", id: todo.id })}>Remove</button>
          </li>
        ))}
      </ul>
      {todos.length === 0 && <p className="muted">Nothing to do.</p>}
    </div>
  );
}

export default TodoList;
