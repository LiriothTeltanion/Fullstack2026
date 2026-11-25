import CategoryBar from "./features/categories/CategoryBar.jsx";
import ProgressPanel from "./features/tasks/ProgressPanel.jsx";
import TaskList from "./features/tasks/TaskList.jsx";

export default function App() {
  return (
    <main>
      <h1>Productivity tracker</h1>
      <CategoryBar />
      <TaskList />
      <ProgressPanel />
    </main>
  );
}
