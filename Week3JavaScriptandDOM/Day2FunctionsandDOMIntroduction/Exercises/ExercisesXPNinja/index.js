// Exercises XP Ninja — Variables, Conditionals, Loops, Functions, DOM

// ------------------------------------------------------------
// Exercise 1: Random Number
// ------------------------------------------------------------
(function exercise1() {
  // Random integer between 1 and 100 (inclusive)
  const n = Math.floor(Math.random() * 100) + 1;
  console.log("Exercise 1 — random n:", n);

  // Log all even numbers from 0 to n (inclusive if n is even)
  const evens = [];
  for (let i = 0; i <= n; i++) {
    if (i % 2 === 0) evens.push(i);
  }
  console.log("Exercise 1 — even numbers 0..n:", evens.join(", "));
})();

// ------------------------------------------------------------
// Exercise 2: Capitalized letters
// ------------------------------------------------------------
/**
 * Return two strings:
 *  - Even indexes capitalized
 *  - Odd indexes capitalized
 * Assumes lowercase input without spaces; function is defensive.
 * @param {string} s
 * @returns {[string, string]}
 */
function capitalize(s) {
  const str = String(s).toLowerCase();
  let evenCaps = "";
  let oddCaps = "";
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (i % 2 === 0) {
      evenCaps += ch.toUpperCase();
      oddCaps += ch;
    } else {
      evenCaps += ch;
      oddCaps += ch.toUpperCase();
    }
  }
  return [evenCaps, oddCaps];
}
console.log("Exercise 2 — capitalize('abcdef'):", capitalize("abcdef"));

// ------------------------------------------------------------
// Exercise 3: Is palindrome?
// ------------------------------------------------------------
/**
 * Check if a string is a palindrome (case-insensitive, ignore non-alphanumerics).
 * @param {string} s
 * @returns {boolean}
 */
function isPalindrome(s) {
  const clean = String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  const rev = clean.split("").reverse().join("");
  return clean.length > 0 && clean === rev;
}
console.log("Exercise 3 — isPalindrome('madam'):", isPalindrome("madam"));
console.log("Exercise 3 — isPalindrome('Kayak'):", isPalindrome("Kayak"));
console.log("Exercise 3 — isPalindrome('palindrome'):", isPalindrome("palindrome"));

// ------------------------------------------------------------
// Exercise 4: Biggest Number
// ------------------------------------------------------------
/**
 * Return the biggest numeric value in the array; ignore non-numbers.
 * If the array is empty or contains no numbers, return 0.
 * @param {any[]} arrayNumber
 * @returns {number}
 */
function biggestNumberInArray(arrayNumber) {
  let max = Number.NEGATIVE_INFINITY;
  let found = false;
  for (let i = 0; i < arrayNumber.length; i++) {
    const val = Number(arrayNumber[i]);
    if (Number.isFinite(val)) {
      if (val > max) max = val;
      found = true;
    }
  }
  return found ? max : 0;
}
console.log("Exercise 4 — examples:");
console.log(biggestNumberInArray([-1, 0, 3, 100, 99, 2, 99])); // 100
console.log(biggestNumberInArray(["a", 3, 4, 2])); // 4
console.log(biggestNumberInArray([])); // 0

// ------------------------------------------------------------
// Exercise 5: Unique Elements
// ------------------------------------------------------------
/**
 * Return a new array with unique elements (order-preserving).
 * @param {any[]} arr
 * @returns {any[]}
 */
function unique(arr) {
  const result = [];
  const seen = new Set();
  for (let i = 0; i < arr.length; i++) {
    const v = arr[i];
    if (!seen.has(v)) {
      seen.add(v);
      result.push(v);
    }
  }
  return result;
}
console.log("Exercise 5 — unique:", unique([1, 2, 3, 3, 3, 3, 4, 5]));

// ------------------------------------------------------------
// Exercise 6: Calendar (DOM)
// ------------------------------------------------------------
/**
 * Create a calendar table for the given year and month (1–12).
 * Week starts on Monday. Appends the table into #calendar-root.
 * @param {number} year
 * @param {number} month1to12
 * @returns {HTMLTableElement}
 */
function createCalendar(year, month1to12) {
  const root = document.getElementById("calendar-root") || document.body;
  const m = Math.max(1, Math.min(12, Math.floor(month1to12))); // clamp
  const monthIndex = m - 1; // JS Date months are 0–11

  // Helpers
  const firstDay = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const jsWeekday = firstDay.getDay(); // 0=Sun..6=Sat
  const mondayFirst = (jsWeekday + 6) % 7; // shift so Mon=0..Sun=6

  // Build table
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const trh = document.createElement("tr");
  const headers = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
  headers.forEach(h => {
    const th = document.createElement("th");
    th.textContent = h;
    trh.appendChild(th);
  });
  thead.appendChild(trh);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  let tr = document.createElement("tr");

  // Leading empty cells (represented with a dot for clarity)
  for (let i = 0; i < mondayFirst; i++) {
    const td = document.createElement("td");
    td.textContent = "·";
    td.className = "muted";
    tr.appendChild(td);
  }

  // Fill days
  let weekday = mondayFirst;
  for (let day = 1; day <= daysInMonth; day++) {
    const td = document.createElement("td");
    td.textContent = String(day);
    tr.appendChild(td);
    weekday++;
    if (weekday === 7) {
      tbody.appendChild(tr);
      tr = document.createElement("tr");
      weekday = 0;
    }
  }

  // Trailing empty cells if needed
  if (weekday !== 0) {
    for (let i = weekday; i < 7; i++) {
      const td = document.createElement("td");
      td.textContent = "·";
      td.className = "muted";
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }

  table.appendChild(tbody);
  // Clear previous content and append
  root.innerHTML = "";
  root.appendChild(table);
  return table;
}

// Demo calendar per instructions sample (September 2012).
createCalendar(2012, 9);

// Expose functions if needed
window.capitalize = capitalize;
window.isPalindrome = isPalindrome;
window.biggestNumberInArray = biggestNumberInArray;
window.unique = unique;
window.createCalendar = createCalendar;
