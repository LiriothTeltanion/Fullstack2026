import { useState } from "react";

// Exercise 1: the buttons switch off at the limits instead of going past them.
export default function Counter({ min, max }) {
  const [count, setCount] = useState(min);

  return (
    <div className="stack">
      <button onClick={() => setCount(c => c - 1)} disabled={count <= min}>
        −
      </button>
      <span className="count">{count}</span>
      <button onClick={() => setCount(c => c + 1)} disabled={count >= max}>
        +
      </button>
      <button onClick={() => setCount(min)}>Reset</button>
      {count === max && <p>That is the maximum ({max}).</p>}
    </div>
  );
}
