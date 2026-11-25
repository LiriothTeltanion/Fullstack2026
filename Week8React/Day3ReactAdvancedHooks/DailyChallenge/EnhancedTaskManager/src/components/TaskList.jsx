import { useTasks } from "../context/TaskContext.jsx";
import TaskItem from "./TaskItem.jsx";

function TaskList() {
  const { state } = useTasks();

  const visible = state.tasks.filter(task => {
    if (state.filter === "active") return !task.completed;
    if (state.filter === "completed") return task.completed;
    return true;
  });

  if (visible.length === 0) {
    return <p className="muted">No tasks here.</p>;
  }

  return (
    <ul className="task-list">
      {visible.map(task => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
}

export default TaskList;
