import { connect } from "react-redux";
import { selectDay, selectSelectedDay } from "../redux/plannerReducer.js";

export function DayPicker({ day, onSelectDay }) {
  return (
    <label className="row">
      Day:
      <input
        type="date"
        value={day}
        onChange={event => event.target.value && onSelectDay(event.target.value)}
      />
    </label>
  );
}

export default connect(state => ({ day: selectSelectedDay(state) }), {
  onSelectDay: selectDay,
})(DayPicker);
