import { useState } from "react";

function BuggyCounter() {
  const [counter, setCounter] = useState(0);

  if (counter === 5) {
    // Throwing during render is what an error boundary can catch.
    throw new Error("I crashed!");
  }

  return (
    <button className="counter" onClick={() => setCounter(counter + 1)}>
      {counter}
    </button>
  );
}

export default BuggyCounter;
