import ActionHistory from "./components/ActionHistory.jsx";
import Counter from "./components/Counter.jsx";
import TodoList from "./components/TodoList.jsx";

export default function App() {
  return (
    <main>
      <h1>Redux basics</h1>
      <p className="muted">
        One store, three reducers, and React components that read and dispatch.
      </p>
      <Counter />
      <TodoList />
      <ActionHistory />
    </main>
  );
}
