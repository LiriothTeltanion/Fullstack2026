import { useSelector } from "react-redux";
import { selectSelectedDay, selectTasksForSelectedDay } from "../redux/plannerReducer.js";
import TaskItem from "./TaskItem.jsx";

export default function TaskList() {
  const day = useSelector(selectSelectedDay);
  const tasks = useSelector(selectTasksForSelectedDay);

  if (tasks.length === 0) {
    return <p className="muted">Nothing planned for {day}.</p>;
  }

  return (
    <ul className="plain">
      {tasks.map(task => (
        <TaskItem key={task.id} day={day} task={task} />
      ))}
    </ul>
  );
}
