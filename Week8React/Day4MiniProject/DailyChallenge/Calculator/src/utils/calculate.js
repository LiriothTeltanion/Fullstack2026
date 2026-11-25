export const operations = {
  add: { symbol: "+", run: (a, b) => a + b },
  subtract: { symbol: "-", run: (a, b) => a - b },
  multiply: { symbol: "×", run: (a, b) => a * b },
  divide: { symbol: "÷", run: (a, b) => a / b },
};

// Returns { result } or { error } so the component never has to catch.
export function calculate(first, second, operation) {
  if (first === "" || second === "") {
    return { error: "Please enter two numbers." };
  }
  const a = Number(first);
  const b = Number(second);
  if (Number.isNaN(a) || Number.isNaN(b)) {
    return { error: "Only numbers, please." };
  }
  if (operation === "divide" && b === 0) {
    return { error: "You can't divide by zero." };
  }
  // Round away floating point noise such as 0.1 + 0.2 = 0.30000000000000004.
  const result = Math.round(operations[operation].run(a, b) * 1e10) / 1e10;
  return { result };
}
