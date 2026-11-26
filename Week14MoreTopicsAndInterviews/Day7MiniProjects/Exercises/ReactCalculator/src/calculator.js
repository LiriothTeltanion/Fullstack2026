// Pure transitions keep keypad behavior independent of React and easy to test.
// Arithmetic is immediate, like a pocket calculator: 2 + 3 × 4 means 20.
export const symbols = { add: "+", subtract: "−", multiply: "×", divide: "÷" };
const operations = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => a / b,
};

export function initialState() {
  return {
    display: "0",
    accumulator: null,
    operator: null,
    waiting: false,
    fresh: false,
    error: null,
    expression: "Ready",
  };
}

export function calculate(a, b, operator) {
  if (!Number.isFinite(a) || !Number.isFinite(b) || !Object.hasOwn(operations, operator)) {
    return { error: "Choose a supported operation and finite numbers." };
  }
  if (operator === "divide" && b === 0) return { error: "You cannot divide by zero." };
  const value = operations[operator](a, b);
  if (!Number.isFinite(value))
    return { error: "The result is outside the supported number range." };
  // Match the tested Week 8 calculator's relative-error rule: remove decimal
  // noise without rounding away tiny results or exactly representable integers.
  const shorter = Number(value.toPrecision(15));
  const result =
    !Number.isInteger(value) && Math.abs(shorter - value) <= Math.abs(value) * Number.EPSILON
      ? shorter
      : value;
  return { result: Object.is(result, -0) ? 0 : result };
}

function failed(error) {
  return {
    ...initialState(),
    display: "Error",
    expression: "Start again with a number or AC",
    error,
  };
}

export function transition(state, action) {
  if (action.type === "clear") return initialState();
  if (action.type === "digit" && /^\d$/.test(action.value)) {
    const next = state.error ? initialState() : state;
    const replace = next.waiting || next.fresh || next.display === "0" || next.display === "-0";
    // Limit typed digits, not the magnitude or precision of computed results.
    if (!replace && next.display.replace(/[-.]/g, "").length >= 16) return next;
    return {
      ...next,
      display: replace
        ? (next.display === "-0" ? "-" : "") + action.value
        : next.display + action.value,
      waiting: false,
      fresh: false,
    };
  }
  if (action.type === "decimal") {
    const next = state.error ? initialState() : state;
    if (next.waiting || next.fresh) return { ...next, display: "0.", waiting: false, fresh: false };
    return next.display.includes(".") || next.display.includes("e")
      ? next
      : { ...next, display: next.display + "." };
  }
  if (state.error) return state;
  if (action.type === "backspace") {
    if (state.waiting || state.fresh || state.display.includes("e")) return state;
    const display = state.display.slice(0, -1);
    return { ...state, display: !display || display === "-" ? "0" : display };
  }
  if (action.type === "sign") {
    if (state.waiting) return { ...state, display: "-0", waiting: false, fresh: false };
    if (Number(state.display) === 0) return state;
    return {
      ...state,
      display: state.display.startsWith("-") ? state.display.slice(1) : "-" + state.display,
      waiting: false,
    };
  }
  if (action.type === "operator" && Object.hasOwn(operations, action.value)) {
    let value = Number(state.display);
    if (state.operator && !state.waiting) {
      const answer = calculate(state.accumulator, value, state.operator);
      if (answer.error) return failed(answer.error);
      value = answer.result;
    }
    return {
      ...state,
      display: String(value),
      accumulator: value,
      operator: action.value,
      waiting: true,
      fresh: false,
      expression: `${value} ${symbols[action.value]}`,
    };
  }
  if (action.type === "equals" && state.operator && !state.waiting) {
    const answer = calculate(state.accumulator, Number(state.display), state.operator);
    if (answer.error) return failed(answer.error);
    return {
      ...initialState(),
      display: String(answer.result),
      fresh: true,
      expression: `${state.accumulator} ${symbols[state.operator]} ${state.display} =`,
    };
  }
  return state;
}

export function keyboardAction(key) {
  if (/^\d$/.test(key)) return { type: "digit", value: key };
  const operator = { "+": "add", "-": "subtract", "*": "multiply", "/": "divide" }[key];
  if (operator) return { type: "operator", value: operator };
  return (
    {
      ".": { type: "decimal" },
      Enter: { type: "equals" },
      "=": { type: "equals" },
      Escape: { type: "clear" },
      Backspace: { type: "backspace" },
    }[key] ?? null
  );
}
