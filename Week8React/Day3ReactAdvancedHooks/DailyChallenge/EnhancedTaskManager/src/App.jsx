import { TaskProvider } from "./context/TaskContext.jsx";
import TaskForm from "./components/TaskForm.jsx";
import FilterBar from "./components/FilterBar.jsx";
import TaskList from "./components/TaskList.jsx";

function App() {
  return (
    <TaskProvider>
      <main className="page narrow">
        <h1>Enhanced Task Manager</h1>
        <div className="card">
          <TaskForm />
          <FilterBar />
          <TaskList />
        </div>
      </main>
    </TaskProvider>
  );
}

export default App;
