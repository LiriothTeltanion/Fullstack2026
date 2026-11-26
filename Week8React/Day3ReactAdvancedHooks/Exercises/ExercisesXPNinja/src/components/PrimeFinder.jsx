import { useMemo, useState } from "react";
import { MAX_LIMIT, primesUpTo } from "../utils/primes.js";

function PrimeFinder() {
  const [draft, setDraft] = useState("20000");
  const limit = Number(draft);
  const valid = Number.isInteger(limit) && limit >= 2 && limit <= MAX_LIMIT;
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
          max={MAX_LIMIT}
          step="1"
          value={draft}
          aria-invalid={!valid}
          aria-describedby="prime-result"
          onChange={event => setDraft(event.target.value)}
        />
      </label>
      <p id="prime-result" role="status">
        {valid
          ? `Found ${result.primes.length} primes in ${result.ms} ms. The last one is ${result.primes.at(-1)}.`
          : `Enter a whole number from 2 to ${MAX_LIMIT}.`}
      </p>
      <button onClick={() => setDarkBox(!darkBox)}>Toggle box color</button>
      <p className="muted">Toggling the color re-renders without recounting.</p>
    </div>
  );
}

export default PrimeFinder;
