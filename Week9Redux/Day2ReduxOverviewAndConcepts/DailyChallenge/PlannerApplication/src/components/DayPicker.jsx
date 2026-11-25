import { useDispatch, useSelector } from "react-redux";
import { selectDay, selectSelectedDay } from "../redux/plannerReducer.js";

export default function DayPicker() {
  const day = useSelector(selectSelectedDay);
  const dispatch = useDispatch();

  return (
    <label className="row">
      Day:
      <input
        type="date"
        value={day}
        onChange={event => event.target.value && dispatch(selectDay(event.target.value))}
      />
    </label>
  );
}
