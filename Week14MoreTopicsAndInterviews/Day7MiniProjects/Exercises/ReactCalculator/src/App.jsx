import { Component } from "react";
import { initialState, keyboardAction, symbols, transition } from "./calculator.js";

const keys = [
  ["AC", "All clear", { type: "clear" }, "utility"],
  ["±", "Change sign", { type: "sign" }, "utility"],
  ["⌫", "Delete last digit", { type: "backspace" }, "utility"],
  ["÷", "Divide", { type: "operator", value: "divide" }, "operator"],
  ...[7, 8, 9].map(n => [String(n), String(n), { type: "digit", value: String(n) }, "digit"]),
  ["×", "Multiply", { type: "operator", value: "multiply" }, "operator"],
  ...[4, 5, 6].map(n => [String(n), String(n), { type: "digit", value: String(n) }, "digit"]),
  ["−", "Subtract", { type: "operator", value: "subtract" }, "operator"],
  ...[1, 2, 3].map(n => [String(n), String(n), { type: "digit", value: String(n) }, "digit"]),
  ["+", "Add", { type: "operator", value: "add" }, "operator"],
  ["0", "0", { type: "digit", value: "0" }, "digit zero"],
  [".", "Decimal point", { type: "decimal" }, "digit"],
  ["=", "Equals", { type: "equals" }, "equals"],
];

function CalculatorKey({ label, accessibleName, action, kind, selected, onAction }) {
  return (
    <button
      type="button"
      className={`key ${kind}`}
      aria-label={accessibleName}
      aria-pressed={kind === "operator" ? selected : undefined}
      onClick={() => onAction(action)}
    >
      {label}
    </button>
  );
}

export default class App extends Component {
  state = initialState();

  dispatch = action => this.setState(current => transition(current, action));

  handleKeyDown = event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    // A focused key keeps its native activation. The calculator surface handles Enter as equals.
    if (event.key === "Enter" && event.target.closest("button")) return;
    const action = keyboardAction(event.key);
    if (action) {
      event.preventDefault();
      this.dispatch(action);
    }
  };

  render() {
    return (
      <main onKeyDown={this.handleKeyDown}>
        <header className="intro">
          <p className="eyebrow">KEVIN CUSNIR / REACT LAB</p>
          <h1>
            Small keys.
            <br />
            <span>Clear thinking.</span>
          </h1>
          <p>A pocket calculator, built with React state and a little precision.</p>
        </header>
        <section className="calculator" aria-label="Calculator" tabIndex="0">
          <div className="instrument">
            <span>CALC / 01</span>
            <span className="indicator">READY TO COUNT</span>
          </div>
          <div className="screen">
            <p className="expression" aria-label="Calculation">
              {this.state.expression}
            </p>
            <output
              aria-label="Result"
              aria-live="polite"
              className={this.state.display.length > 14 ? "compact" : ""}
            >
              {this.state.display}
            </output>
          </div>
          <div className="keypad" aria-label="Number and operator keys">
            {keys.map(([label, accessibleName, action, kind]) => (
              <CalculatorKey
                key={label}
                label={label}
                accessibleName={accessibleName}
                action={action}
                kind={kind}
                selected={this.state.operator && symbols[this.state.operator] === label}
                onAction={this.dispatch}
              />
            ))}
          </div>
          <p className="feedback" role="status">
            {this.state.error ?? "Click a key, or focus the calculator and type."}
          </p>
        </section>
        <footer>
          0–9 · + − × ÷ · Enter = · Esc clears
          <br />
          Immediate calculation, one step at a time.
        </footer>
      </main>
    );
  }
}
