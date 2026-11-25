import { useTasks } from "../context/TaskContext.jsx";

const filters = ["all", "active", "completed"];

function FilterBar() {
  const { state, dispatch } = useTasks();
  const left = state.tasks.filter(task => !task.completed).length;

  return (
    <div className="filter-bar">
      <span className="muted">{left} left</span>
      <div>
        {filters.map(filter => (
          <button
            key={filter}
            className={state.filter === filter ? "chip active" : "chip"}
            onClick={() => dispatch({ type: "SET_FILTER", filter })}
          >
            {filter}
          </button>
        ))}
      </div>
      <button className="chip" onClick={() => dispatch({ type: "CLEAR_COMPLETED" })}>
        Clear completed
      </button>
    </div>
  );
}

export default FilterBar;
