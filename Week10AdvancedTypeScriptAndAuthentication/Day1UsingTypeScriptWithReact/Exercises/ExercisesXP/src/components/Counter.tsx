import { useState } from "react";

// Exercise 2: useState with an explicit number type.
export default function Counter({ start = 0 }: { start?: number }) {
  const [count, setCount] = useState<number>(start);

  return (
    <div className="row">
      <button onClick={() => setCount(value => value - 1)}>-1</button>
      <span className="big">{count}</span>
      <button onClick={() => setCount(value => value + 1)}>+1</button>
    </div>
  );
}
