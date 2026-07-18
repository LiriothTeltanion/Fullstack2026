// Exercises XP — Advanced JS
// Code is short & simple, with English comments throughout.

// -----------------------------
// Ex. 1 — Scope (Predictions)
// -----------------------------
// We keep original snippets but DON'T run the alerts to avoid pop-ups.
// Predictions are written as comments next to each snippet.

// #1
function funcOne() {
  let a = 5;
  if (a > 1) {
    a = 3; // reassign allowed with let
  }
  // Prediction: alerts "inside the funcOne function 3"
  // alert(`inside the funcOne function ${a}`);
}
// #1.1 would show "3".
// #1.2 If a were const: reassigning a = 3 would THROW a TypeError at runtime.

// #2
let a2 = 0;
function funcTwo() {
  a2 = 5; // reassigns the outer variable
}
function funcThree() {
  // Prediction:
  // First call -> alerts "0" (since funcTwo not called yet)
  // After funcTwo -> alerts "5"
  // alert(`inside the funcThree function ${a2}`);
}
// #2.2 If a2 were const: funcTwo() would try to reassign a2 and THROW a TypeError.

// #3
function funcFour() {
  window.a3 = "hello"; // set a global property
}
function funcFive() {
  // Prediction: after calling funcFour(), this would alert "hello"
  // alert(`inside the funcFive function ${a3}`);
}

// #4
let a4 = 1;
function funcSix() {
  let a4 = "test"; // shadowing outer a4
  // Prediction: alerts "test"
  // alert(`inside the funcSix function ${a4}`);
}
// If inner a4 were const instead of let, result is the same (no reassignment).
// Both are block-scoped; shadowing still applies.

// #5
let a5 = 2;
if (true) {
  let a5 = 5; // new block-scoped variable
  // Prediction: alert in the block would be "5"
  // alert(`in the if block ${a5}`);
}
// Prediction: alert outside the block would be "2"
// alert(`outside of the if block ${a5}`);
// Using const instead of let has the same scoping behavior (no reassignment is made).

// A tiny summary function for the UI
function scopeSummary() {
  return [
    "#1 -> 3 (const would throw on reassignment)",
    "#2 -> 0 then 5 (const would throw in funcTwo on reassign)",
    "#3 -> 'hello' after funcFour sets window.a3",
    "#4 -> 'test' due to shadowing (const same here)",
    "#5 -> in-block 5, outside 2 (const same scoping)",
  ].join("\\n");
}

// -----------------------------
// Ex. 2 — Ternary operator
// -----------------------------
const winBattle = () => true; // arrow function version
const experiencePoints = winBattle() ? 10 : 1;

// -----------------------------
// Ex. 3 — Is it a string?
// -----------------------------
const isString = val => typeof val === "string" || val instanceof String;

// -----------------------------
// Ex. 4 — Find the sum (one-liner)
// -----------------------------
const add = (x, y) => x + y;

// -----------------------------
// Ex. 5 — Kg and grams
// -----------------------------
// a) function declaration
function toGramsDecl(kg) {
  return kg * 1000;
}
// b) function expression
const toGramsExpr = function (kg) {
  return kg * 1000;
};
// c) one-line arrow
const toGramsArrow = kg => kg * 1000;
// Difference (one-line comment):
// Declaration is hoisted with its body; expression is NOT hoisted (only the const/var is).

// -----------------------------
// Ex. 6 — Fortune teller (IIFE)
// -----------------------------
(function (children, partner, location, job) {
  const msg = `You will be a ${job} in ${location}, and married to ${partner} with ${children} kids.`;
  document.getElementById("fortune").textContent = msg;
})(2, "Alex", "Reykjavik", "Developer");

// -----------------------------
// Ex. 7 — Welcome (Navbar via IIFE)
// -----------------------------
(function (name) {
  const nav = document.getElementById("navbar");
  // Update user name text
  document.getElementById("navUser").textContent = name;
  // Simple avatar initial
  const initial = name?.[0]?.toUpperCase() || "?";
  document.getElementById("navAvatar").textContent = initial;
})("Kevin");

// -----------------------------
// Ex. 8 — Juice Bar (nested functions)
// -----------------------------
// Part I: simple version (single call)
function makeJuiceV1(size) {
  function addIngredients(i1, i2, i3) {
    const line = `The client wants a ${size} juice, containing ${i1}, ${i2}, ${i3}.`;
    console.log("[Juice V1]", line);
  }
  addIngredients("apple", "banana", "mint");
}

// Part II: with ingredients array, two adds + display
function makeJuice(size) {
  const ingredients = []; // closed-over array

  function addIngredients(i1, i2, i3) {
    ingredients.push(i1, i2, i3);
  }

  function displayJuice() {
    const line = `The client wants a ${size} juice, containing ${ingredients.join(", ")}.`;
    document.getElementById("juiceOut").textContent = line;
  }

  // The client wants 6 ingredients total (call twice)
  addIngredients("orange", "ginger", "spinach");
  addIngredients("apple", "lemon", "mint");
  displayJuice();
}

// -----------------------------
// Small UI hooks
// -----------------------------
document.getElementById("btnScope").addEventListener("click", () => {
  document.getElementById("scopeOut").textContent = scopeSummary();
  console.log("Scope predictions:\\n" + scopeSummary());
});

document.getElementById("btnRunSmall").addEventListener("click", () => {
  const lines = [];
  lines.push(`winBattle() -> ${winBattle()}`);
  lines.push(`experiencePoints -> ${experiencePoints}`);
  lines.push(`isString('hello') -> ${isString("hello")}`);
  lines.push(`isString([1,2]) -> ${isString([1, 2])}`);
  lines.push(`add(3,4) -> ${add(3, 4)}`);
  lines.push(`toGramsDecl(2) -> ${toGramsDecl(2)}`);
  lines.push(`toGramsExpr(2) -> ${toGramsExpr(2)}`);
  lines.push(`toGramsArrow(2) -> ${toGramsArrow(2)}`);
  document.getElementById("smallOut").textContent = lines.join(" | ");
  console.log(lines.join("\\n"));
});

document.getElementById("btnJuice").addEventListener("click", () => {
  makeJuiceV1("medium"); // console-only demo
  makeJuice("large"); // writes to DOM
});
