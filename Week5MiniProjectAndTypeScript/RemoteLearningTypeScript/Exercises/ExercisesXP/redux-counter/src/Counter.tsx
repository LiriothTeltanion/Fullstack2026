import { useDispatch, useSelector } from "react-redux";
import { decrement, increment } from "./counterSlice";
import type { AppDispatch, RootState } from "./store";

export default function Counter() {
  const value = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <section className="counter" aria-labelledby="counter-heading">
      <p className="eyebrow">React · TypeScript · Redux Toolkit</p>
      <h1 id="counter-heading">One action at a time.</h1>
      <p className="intro">A typed counter powered by a Redux slice.</p>
      <p className="value" aria-label="Counter value" aria-live="polite" aria-atomic="true">
        {value}
      </p>
      <div className="actions">
        <button type="button" onClick={() => dispatch(increment())}>
          Increment
        </button>
        <button type="button" className="secondary" onClick={() => dispatch(decrement())}>
          Decrement
        </button>
      </div>
      <p className="hint">Starts at zero. Negative values are allowed. Reload to start again.</p>
    </section>
  );
}
