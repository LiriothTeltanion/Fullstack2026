// Exercise 5: a command-line calculator that reads process.argv
// Usage: node calculator.js 12 x 3.5
const [, , left, operator, right] = process.argv;

const operations = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  x: (a, b) => a * b, // "x" because "*" gets expanded by the shell
  "/": (a, b) => (b === 0 ? NaN : a / b),
};

const a = Number(left);
const b = Number(right);

if (!(operator in operations) || Number.isNaN(a) || Number.isNaN(b)) {
  console.log("Usage: node calculator.js <number> <+ - x /> <number>");
  process.exitCode = 1;
} else {
  const result = operations[operator](a, b);
  console.log(`${a} ${operator} ${b} = ${Number.isNaN(result) ? "cannot divide by 0" : result}`);
}
