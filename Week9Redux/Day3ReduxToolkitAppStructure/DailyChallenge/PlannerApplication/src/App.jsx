import DayTasks from "./features/planner/DayTasks.jsx";
import WeekStrip from "./features/planner/WeekStrip.jsx";

export default function App() {
  return (
    <main>
      <h1>Weekly planner</h1>
      <WeekStrip />
      <DayTasks />
    </main>
  );
}
