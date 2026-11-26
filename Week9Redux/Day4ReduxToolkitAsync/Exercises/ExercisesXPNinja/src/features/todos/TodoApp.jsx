import { useId, useRef, useState } from "react";
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
  const [error, setError] = useState(null);
  const input = useRef(null);
  const editRevision = useRef(0);
  const pendingAdd = useRef(false);
  const errorId = useId();

  const handleSubmit = async event => {
    event.preventDefault();
    if (pendingAdd.current) return;
    if (!title.trim()) {
      setError({ kind: "input", message: "Enter a todo with at least one non-space character." });
      input.current?.focus();
      return;
    }
    const submittedDraft = title;
    const submittedRevision = editRevision.current;
    pendingAdd.current = true;
    setError(null);
    setTitle("");
    try {
      await addTodo(submittedDraft.trim()).unwrap();
    } catch {
      // Restore the failed draft only if the user has not typed a newer one.
      const hasNewerDraft = editRevision.current !== submittedRevision;
      setTitle(current => (hasNewerDraft ? current : submittedDraft));
      setError({
        kind: "request",
        message: "Could not add the todo. Review the current draft and try again.",
      });
      if (!hasNewerDraft) input.current?.focus();
    } finally {
      pendingAdd.current = false;
    }
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
      <form className="row" onSubmit={handleSubmit} noValidate>
        <input
          ref={input}
          value={title}
          onChange={event => {
            editRevision.current += 1;
            setTitle(event.target.value);
            setError(null);
          }}
          aria-label="New todo"
          aria-describedby={error ? errorId : undefined}
          aria-invalid={error?.kind === "input" || undefined}
          required
          dir="auto"
        />
        <button type="submit" disabled={isAdding}>
          Add
        </button>
        <button type="button" className="secondary" onClick={refetch} disabled={isFetching}>
          Refetch
        </button>
      </form>
      {error && (
        <p className="error" id={errorId} role="alert">
          {error.message}
        </p>
      )}
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
