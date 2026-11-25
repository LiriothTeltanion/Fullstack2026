import { useState } from "react";

// Exercise 2: useState with an explicit number type.
export default function Counter({ start = 0 }: { start?: number }) {
  const [count, setCount] = useState<number>(start);
  const [lastAction, setLastAction] = useState<"none" | "increment" | "decrement">("none");

  const increment = () => {
    setCount(value => value + 1);
    setLastAction("increment");
  };
  const decrement = () => {
    setCount(value => value - 1);
    setLastAction("decrement");
  };

  return (
    <div>
      <div className="row">
        <button onClick={decrement}>-1</button>
        <span className="big">{count}</span>
        <button onClick={increment}>+1</button>
      </div>
      <p role="status" aria-label="Counter action">
        Last action: {lastAction}
      </p>
    </div>
  );
}
