export const operations = {
  add: { symbol: "+", run: (a, b) => a + b },
  subtract: { symbol: "-", run: (a, b) => a - b },
  multiply: { symbol: "×", run: (a, b) => a * b },
  divide: { symbol: "÷", run: (a, b) => a / b },
};

// Returns { result } or { error } so the component never has to catch.
export function calculate(first, second, operation) {
  if (String(first).trim() === "" || String(second).trim() === "") {
    return { error: "Please enter two numbers." };
  }
  const a = Number(first);
  const b = Number(second);
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    return { error: "Only numbers, please." };
  }
  if (!Object.hasOwn(operations, operation)) {
    return { error: "Please choose an operation." };
  }
  if (operation === "divide" && b === 0) {
    return { error: "You can't divide by zero." };
  }
  const result = operations[operation].run(a, b);
  if (!Number.isFinite(result)) {
    return { error: "The result is outside the supported number range." };
  }
  // Keep integers intact, including every exactly representable safe integer.
  // A fixed decimal scale would erase small values and overflow large ones.
  if (Number.isInteger(result)) return { result };

  // Remove a trailing floating-point artifact only when the shorter value is
  // within one relative machine epsilon of the original calculation.
  const shorter = Number(result.toPrecision(15));
  const tolerance = Math.abs(result) * Number.EPSILON;
  return {
    result: Math.abs(shorter - result) <= tolerance ? shorter : result,
  };
}
