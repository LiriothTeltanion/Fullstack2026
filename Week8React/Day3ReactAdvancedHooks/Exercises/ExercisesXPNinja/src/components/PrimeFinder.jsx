import { useMemo, useState } from "react";
import { primesUpTo } from "../utils/primes.js";

function PrimeFinder() {
  const [limit, setLimit] = useState(20000);
  const [darkBox, setDarkBox] = useState(false);

  // Only recalculated when limit changes, not when the box color changes.
  const result = useMemo(() => {
    const start = performance.now();
    const primes = primesUpTo(limit);
    return { primes, ms: (performance.now() - start).toFixed(1) };
  }, [limit]);

  return (
    <div className={darkBox ? "box dark-box" : "box"}>
      <label>
        Primes up to{" "}
        <input
          type="number"
          min="2"
          max="200000"
          value={limit}
          onChange={event => setLimit(Math.min(200000, Number(event.target.value) || 2))}
        />
      </label>
      <p>
        Found {result.primes.length} primes in {result.ms} ms. The last one is{" "}
        {result.primes.at(-1)}.
      </p>
      <button onClick={() => setDarkBox(!darkBox)}>Toggle box color</button>
      <p className="muted">Toggling the color re-renders without recounting.</p>
    </div>
  );
}

export default PrimeFinder;
