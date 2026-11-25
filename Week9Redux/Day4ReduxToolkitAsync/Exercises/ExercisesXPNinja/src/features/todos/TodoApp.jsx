import { useState } from "react";
import {
  useAddTodoMutation,
  useDeleteTodoMutation,
  useGetTodosQuery,
  useToggleTodoMutation,
} from "./todosApi.js";

export default function TodoApp() {
  const { data: todos = [], isLoading, isError, isFetching, refetch } = useGetTodosQuery();
  const [addTodo, { isLoading: isAdding }] = useAddTodoMutation();
  const [toggleTodo] = useToggleTodoMutation();
  const [deleteTodo] = useDeleteTodoMutation();
  const [title, setTitle] = useState("");

  const handleSubmit = event => {
    event.preventDefault();
    if (!title.trim()) return;
    addTodo(title.trim());
    setTitle("");
  };

  if (isLoading) return <div className="spinner" role="status" aria-label="Loading todos" />;
  if (isError) {
    return (
      <p className="error">
        Could not load the todos. <button onClick={refetch}>Try again</button>
      </p>
    );
  }

  return (
    <section className="card">
      <form className="row" onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={event => setTitle(event.target.value)}
          aria-label="New todo"
        />
        <button type="submit" disabled={isAdding}>
          Add
        </button>
        <button type="button" className="secondary" onClick={refetch} disabled={isFetching}>
          Refetch
        </button>
      </form>
      <ul className="plain">
        {todos.map(todo => (
          <li key={todo.id}>
            <label className={todo.completed ? "done" : ""}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo({ id: todo.id, completed: !todo.completed })}
              />{" "}
              {todo.title}
            </label>
            <button className="danger" onClick={() => deleteTodo(todo.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
