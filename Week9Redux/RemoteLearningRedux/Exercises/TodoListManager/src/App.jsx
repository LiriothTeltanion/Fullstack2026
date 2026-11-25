import TodoManager from "./features/todos/TodoManager.jsx";

export default function App() {
  return (
    <main>
      <h1>Todo list manager</h1>
      <p className="muted">Double-click a todo to edit it. Enter saves, Escape cancels.</p>
      <TodoManager />
    </main>
  );
}
