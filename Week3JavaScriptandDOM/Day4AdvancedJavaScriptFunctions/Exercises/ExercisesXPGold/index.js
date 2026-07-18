// Exercises XP Gold — Advanced Functions
// Last Updated: October 7th, 2025
//
// Run with: node index.js
//
// Includes solutions + console outputs for:
// 1) Nested functions (refactored to nested arrow functions)
// 2) Closure
// 3) Currying (two variants)
// 4) Function composition

// ---------------------------------------------
// Exercise 1 — Nested functions (arrow version)
// ---------------------------------------------
// Predicted output: "____/''''\____"
const landscape = () => {
  let result = "";

  const flat = x => {
    for (let i = 0; i < x; i++) result += "_";
  };

  const mountain = x => {
    result += "/";
    for (let i = 0; i < x; i++) result += "'";
    result += "\\"; // note backslash escape
  };

  flat(4);
  mountain(4);
  flat(4);
  return result;
};

console.log("Exercise 1:", landscape()); // ____/''''\____

// -----------------------
// Exercise 2 — Closure
// -----------------------
// Prediction: 13
const addTo = x => y => x + y;
const addToTen = addTo(10);
console.log("Exercise 2:", addToTen(3)); // 13

// -----------------------
// Exercise 3 — Currying
// -----------------------
// Prediction: 31
const curriedSum = a => b => a + b;
console.log("Exercise 3:", curriedSum(30)(1)); // 31

// -----------------------
// Exercise 4 — Currying (again)
// -----------------------
// Prediction: 17
const add5 = curriedSum(5);
console.log("Exercise 4:", add5(12)); // 17

// -----------------------
// Exercise 5 — Composing
// -----------------------
// Prediction: 16
const compose = (f, g) => a => f(g(a));
const inc = n => n + 1;
const plus5 = n => n + 5;
console.log("Exercise 5:", compose(inc, plus5)(10)); // 16
