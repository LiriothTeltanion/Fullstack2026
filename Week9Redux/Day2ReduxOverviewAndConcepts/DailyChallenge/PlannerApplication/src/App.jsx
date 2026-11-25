import DayPicker from "./components/DayPicker.jsx";
import TaskForm from "./components/TaskForm.jsx";
import TaskList from "./components/TaskList.jsx";

export default function App() {
  return (
    <main>
      <h1>Daily planner</h1>
      <section className="card">
        <DayPicker />
      </section>
      <section className="card">
        <TaskForm />
        <TaskList />
      </section>
    </main>
  );
}
