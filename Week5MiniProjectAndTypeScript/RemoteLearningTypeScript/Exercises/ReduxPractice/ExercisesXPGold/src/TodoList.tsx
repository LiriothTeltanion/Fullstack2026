import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { deleteTodo, toggleTodo, today } from "./todoSlice";
type Filter = "all" | "completed" | "incomplete" | "overdue";
export default function TodoList() {
  const items = useAppSelector(s => s.todos.items),
    warning = useAppSelector(s => s.todos.storageError),
    dispatch = useAppDispatch(),
    [filter, setFilter] = useState<Filter>("all");
  const visible = items.filter(
    t =>
      filter === "all" ||
      (filter === "completed" && t.completed) ||
      (filter === "incomplete" && !t.completed) ||
      (filter === "overdue" && !t.completed && t.dueDate < today())
  );
  return (
    <section>
      <div className="section-heading">
        <h2>
          Your next steps <small>({items.length})</small>
        </h2>
        <label>
          Show tasks
          <select value={filter} onChange={e => setFilter(e.target.value as Filter)}>
            <option value="all">All tasks</option>
            <option value="completed">Completed</option>
            <option value="incomplete">Incomplete</option>
            <option value="overdue">Overdue</option>
          </select>
        </label>
      </div>
      {warning && <p role="alert">{warning}</p>}
      {!visible.length ? (
        <p className="panel empty">No tasks in this view.</p>
      ) : (
        <ul className="task-list">
          {visible.map(t => (
            <li
              key={t.id}
              className={
                "panel task " + (t.completed ? "completed" : t.dueDate < today() ? "overdue" : "")
              }
            >
              <label className="task-title">
                <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={() => dispatch(toggleTodo(t.id))}
                />
                <strong>{t.title}</strong>
              </label>
              <p>
                <time dateTime={t.dueDate}>Due {t.dueDate}</time> ·{" "}
                {t.completed ? "Completed" : t.dueDate < today() ? "Overdue" : "In progress"}
              </p>
              <small>Added {new Date(t.createdAt).toLocaleDateString()}</small>
              <button
                className="secondary"
                onClick={() => dispatch(deleteTodo(t.id))}
                aria-label={"Delete " + t.title}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
