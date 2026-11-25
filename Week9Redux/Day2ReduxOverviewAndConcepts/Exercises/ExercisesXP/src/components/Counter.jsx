import { useDispatch, useSelector } from "react-redux";
import { decrement, increment, reset } from "../redux/actions.js";

export default function Counter() {
  const value = useSelector(state => state.counter.value);
  const dispatch = useDispatch();

  return (
    <section className="card">
      <h2>Counter</h2>
      <p className="big">{value}</p>
      <div className="row">
        <button onClick={() => dispatch(decrement())}>-1</button>
        <button onClick={() => dispatch(increment())}>+1</button>
        <button className="secondary" onClick={() => dispatch(reset())}>
          Reset
        </button>
      </div>
    </section>
  );
}
