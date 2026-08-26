// Daily Challenge: True or False
// Beginner-style code with small comments

// 1) The function: returns true only if every value is truthy.
// Falsy values in JS are: false, 0, "", null, undefined, NaN
function allTruthy(...values) {
  for (const v of values) {
    if (!v) {
      return false;
    }
  }
  return true;
}

// (FYI) a shorter version could be:
// const allTruthy = (...values) => values.every(Boolean);

// 2) Hook up demo buttons
const out = document.getElementById("testOutput");

document.getElementById("btnA").addEventListener("click", () => {
  const result = allTruthy(true, true, true);
  out.textContent = "allTruthy(true, true, true) → " + result;
});

document.getElementById("btnB").addEventListener("click", () => {
  const result = allTruthy(true, false, true);
  out.textContent = "allTruthy(true, false, true) → " + result;
});

document.getElementById("btnC").addEventListener("click", () => {
  const result = allTruthy(5, 4, 3, 2, 1, 0);
  out.textContent = "allTruthy(5, 4, 3, 2, 1, 0) → " + result;
});

// 3) Custom input parser (very basic). I try to convert common literals.
// Examples the parser handles: true, false, null, undefined, 0, 1, "", '' , numbers
function parseToken(token) {
  const t = token.trim();

  if (t === "true") return true;
  if (t === "false") return false;
  if (t === "null") return null;
  if (t === "undefined") return undefined;
  if (t === "NaN") return NaN;
  if (t === '""' || t === "''") return "";

  // If quoted like "hello" or 'hello', remove quotes
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    return t.slice(1, -1);
  }

  // Numbers (e.g., 42, 0, -3.14)
  const num = Number(t);
  if (!Number.isNaN(num)) return num;

  // Otherwise keep as a string
  return t;
}

const rawInput = document.getElementById("rawInput");
const customOutput = document.getElementById("customOutput");
document.getElementById("runCustom").addEventListener("click", () => {
  const parts = rawInput.value.split(",");
  const values = parts.map(parseToken);

  const result = allTruthy(...values);
  const show = {
    values,
    result,
  };
  customOutput.textContent = JSON.stringify(show, null, 2);
});
