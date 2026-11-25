import { useState } from "react";

const operations = {
  "+": (a, b) => a + b,
  "−": (a, b) => a - b,
  "×": (a, b) => a * b,
  "÷": (a, b) => (b === 0 ? "Cannot divide by 0" : a / b),
};

// Exercise 1: inputs keep strings in state; Number() only at calculation time.
export default function Calculator() {
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [operator, setOperator] = useState("+");
  const [result, setResult] = useState(null);

  function calculate(event) {
    event.preventDefault();
    if (first === "" || second === "") {
      setResult("Fill in both numbers");
      return;
    }
    setResult(operations[operator](Number(first), Number(second)));
  }

  return (
    <form className="row" onSubmit={calculate}>
      <input
        type="number"
        value={first}
        onChange={e => setFirst(e.target.value)}
        aria-label="First number"
      />
      <select value={operator} onChange={e => setOperator(e.target.value)} aria-label="Operation">
        {Object.keys(operations).map(op => (
          <option key={op}>{op}</option>
        ))}
      </select>
      <input
        type="number"
        value={second}
        onChange={e => setSecond(e.target.value)}
        aria-label="Second number"
      />
      <button type="submit">=</button>
      <output>{result}</output>
    </form>
  );
}
