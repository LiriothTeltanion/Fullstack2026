import type { Todo } from "../types";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const BADGE: Record<Todo["priority"], string> = {
  low: "#4ade80",
  medium: "#fbbf24",
  high: "#f87171",
};

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <li>
      <label className={todo.completed ? "done" : ""}>
        <input type="checkbox" checked={todo.completed} onChange={() => onToggle(todo.id)} />{" "}
        {todo.text} <small style={{ color: BADGE[todo.priority] }}>● {todo.priority}</small>
      </label>
      <button className="danger" onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </li>
  );
}
