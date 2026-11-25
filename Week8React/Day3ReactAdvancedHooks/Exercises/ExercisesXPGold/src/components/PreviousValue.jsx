import { useState } from "react";
import { usePrevious } from "../hooks/usePrevious.js";

function PreviousValue() {
  const [count, setCount] = useState(0);
  const previous = usePrevious(count);

  return (
    <div>
      <p>
        Now: {count} · Before: {previous ?? "none"}
      </p>
      <button onClick={() => setCount(count + 1)}>+1</button>{" "}
      <button onClick={() => setCount(count - 1)}>−1</button>
    </div>
  );
}

export default PreviousValue;
