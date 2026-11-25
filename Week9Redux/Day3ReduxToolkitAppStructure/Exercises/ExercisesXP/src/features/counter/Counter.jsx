import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { decrement, increment, incrementByAmount, reset, selectCount } from "./counterSlice.js";

export default function Counter() {
  const count = useSelector(selectCount);
  const dispatch = useDispatch();
  const [amount, setAmount] = useState("5");
  const step = Number(amount) || 0;

  return (
    <section className="card">
      <h2>Counter slice</h2>
      <p className="big">{count}</p>
      <div className="row">
        <button onClick={() => dispatch(decrement())}>-1</button>
        <button onClick={() => dispatch(increment())}>+1</button>
        <input
          type="number"
          value={amount}
          onChange={event => setAmount(event.target.value)}
          aria-label="Amount to add"
          style={{ width: "5rem" }}
        />
        <button onClick={() => dispatch(incrementByAmount(step))}>Add amount</button>
        <button className="secondary" onClick={() => dispatch(reset())}>
          Reset
        </button>
      </div>
    </section>
  );
}
