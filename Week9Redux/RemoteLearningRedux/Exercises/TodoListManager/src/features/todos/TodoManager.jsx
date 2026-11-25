import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TodoItem from "./TodoItem.jsx";
import {
  FILTERS,
  allToggled,
  completedCleared,
  filterChanged,
  selectCounts,
  selectFilter,
  selectVisibleTodos,
  todoAdded,
} from "./todosSlice.js";

export default function TodoManager() {
  const todos = useSelector(selectVisibleTodos);
  const counts = useSelector(selectCounts);
  const filter = useSelector(selectFilter);
  const dispatch = useDispatch();
  const [text, setText] = useState("");

  const handleSubmit = event => {
    event.preventDefault();
    if (!text.trim()) return;
    dispatch(todoAdded(text.trim()));
    setText("");
  };

  return (
    <section className="card">
      <form className="row" onSubmit={handleSubmit}>
        <button
          type="button"
          className="secondary"
          onClick={() => dispatch(allToggled())}
          disabled={!counts.total}
          aria-label="Toggle all todos"
        >
          ✓ all
        </button>
        <input
          value={text}
          onChange={event => setText(event.target.value)}
          placeholder="Add a todo and press Enter"
          aria-label="New todo"
        />
      </form>

      <ul className="plain">
        {todos.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
      {counts.total > 0 && todos.length === 0 && <p className="muted">Nothing in this view.</p>}

      <div className="row" style={{ justifyContent: "space-between", marginTop: 12 }}>
        <span className="muted">{counts.active} item(s) left</span>
        <span className="row">
          {FILTERS.map(name => (
            <button
              key={name}
              className={name === filter ? "" : "secondary"}
              onClick={() => dispatch(filterChanged(name))}
              aria-pressed={name === filter}
            >
              {name}
            </button>
          ))}
        </span>
        <button
          className="secondary"
          onClick={() => dispatch(completedCleared())}
          disabled={!counts.completed}
        >
          Clear completed ({counts.completed})
        </button>
      </div>
    </section>
  );
}
