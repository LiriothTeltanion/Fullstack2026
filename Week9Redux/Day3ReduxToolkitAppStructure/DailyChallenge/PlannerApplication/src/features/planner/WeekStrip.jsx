import { useDispatch, useSelector } from "react-redux";
import { shiftDays, weekOf } from "./dates.js";
import { daySelected, selectSelectedDay } from "./plannerSlice.js";

const NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function WeekStrip() {
  const selected = useSelector(selectSelectedDay);
  const tasksByDay = useSelector(state => state.planner.tasksByDay);
  const dispatch = useDispatch();
  const days = weekOf(selected);

  return (
    <section className="card">
      <div className="row" style={{ justifyContent: "space-between", marginBottom: 10 }}>
        <button
          className="secondary"
          onClick={() => dispatch(daySelected(shiftDays(selected, -7)))}
        >
          ← Previous week
        </button>
        <input
          type="date"
          value={selected}
          onChange={event => event.target.value && dispatch(daySelected(event.target.value))}
          aria-label="Pick a day"
        />
        <button className="secondary" onClick={() => dispatch(daySelected(shiftDays(selected, 7)))}>
          Next week →
        </button>
      </div>
      <div className="week">
        {days.map((day, index) => (
          <button
            key={day}
            className={day === selected ? "" : "secondary"}
            onClick={() => dispatch(daySelected(day))}
            aria-pressed={day === selected}
          >
            {NAMES[index]} {Number(day.slice(8))}
            <small>{tasksByDay[day]?.length ?? 0} tasks</small>
          </button>
        ))}
      </div>
    </section>
  );
}
