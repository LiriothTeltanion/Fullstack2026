import { useState } from "react";
import { calculate, operations } from "./utils/calculate.js";

function App() {
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [operation, setOperation] = useState("add");
  const [output, setOutput] = useState(null);
  const [history, setHistory] = useState([]);

  const handleSubmit = event => {
    event.preventDefault();
    const answer = calculate(first, second, operation);
    setOutput(answer);
    if (answer.error) return;
    const line = `${first} ${operations[operation].symbol} ${second} = ${answer.result}`;
    // Keep only the last five calculations.
    setHistory([line, ...history].slice(0, 5));
  };

  return (
    <main className="page narrow">
      <h1>Calculator</h1>
      <form className="card calculator" onSubmit={handleSubmit}>
        <input
          type="number"
          step="any"
          value={first}
          onChange={event => setFirst(event.target.value)}
          aria-label="First number"
        />
        <select
          value={operation}
          onChange={event => setOperation(event.target.value)}
          aria-label="Operation"
        >
          {Object.entries(operations).map(([name, op]) => (
            <option key={name} value={name}>
              {op.symbol} {name}
            </option>
          ))}
        </select>
        <input
          type="number"
          step="any"
          value={second}
          onChange={event => setSecond(event.target.value)}
          aria-label="Second number"
        />
        <button type="submit">Calculate</button>
      </form>

      {output && (
        <p className={output.error ? "card error" : "card result"}>
          {output.error || output.result}
        </p>
      )}

      {history.length > 0 && (
        <section className="card">
          <h2>Last results</h2>
          <ul>
            {history.map((line, i) => (
              <li key={`${line}-${i}`}>{line}</li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}

export default App;
