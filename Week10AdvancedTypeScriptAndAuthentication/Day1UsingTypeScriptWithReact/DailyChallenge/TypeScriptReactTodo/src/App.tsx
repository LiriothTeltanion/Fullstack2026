import { useState } from "react";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import type { Filter, Priority, Todo } from "./types";

const FILTERS: Filter[] = ["all", "active", "completed"];
const RANK: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>("all");

  const addTodo = (text: string, priority: Priority) => {
    setTodos(current => [...current, { id: Date.now(), text, completed: false, priority }]);
  };

  const toggleTodo = (id: number) => {
    setTodos(current =>
      current.map(todo => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(current => current.filter(todo => todo.id !== id));
  };

  const visible = todos
    .filter(todo =>
      filter === "all" ? true : filter === "active" ? !todo.completed : todo.completed
    )
    .sort((a, b) => RANK[a.priority] - RANK[b.priority]);

  const left = todos.filter(todo => !todo.completed).length;

  return (
    <main>
      <h1>Typed todo list</h1>
      <section className="card">
        <TodoForm onAdd={addTodo} />
      </section>
      <section className="card">
        <div className="row" style={{ justifyContent: "space-between", marginBottom: 8 }}>
          <span className="muted">{left} left</span>
          <span className="row">
            {FILTERS.map(name => (
              <button
                key={name}
                className={name === filter ? "" : "secondary"}
                onClick={() => setFilter(name)}
                aria-pressed={name === filter}
              >
                {name}
              </button>
            ))}
          </span>
        </div>
        <TodoList todos={visible} onToggle={toggleTodo} onDelete={deleteTodo} />
      </section>
    </main>
  );
}
