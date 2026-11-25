import { connect } from "react-redux";
import { selectSelectedDay, selectTasksForSelectedDay } from "../redux/plannerReducer.js";
import TaskItem from "./TaskItem.jsx";

export function TaskList({ day, tasks }) {
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

export default connect(state => ({
  day: selectSelectedDay(state),
  tasks: selectTasksForSelectedDay(state),
}))(TaskList);
