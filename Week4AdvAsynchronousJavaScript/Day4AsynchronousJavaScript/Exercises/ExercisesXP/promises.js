// Exercises XP — Promises

// --------------------
// Exercise 1: Comparison
// --------------------
// Return a Promise that resolves if num <= 10, rejects otherwise.
const compareToTen = num =>
  new Promise((resolve, reject) => {
    if (num <= 10) {
      resolve(`OK: ${num} <= 10`);
    } else {
      reject(`Error: ${num} is greater than 10`);
    }
  });

// --------------------
// Exercise 2: Promises
// --------------------
// Create a promise that resolves in 4 seconds with "success".
const delayedSuccess = new Promise(resolve => {
  setTimeout(() => resolve("success"), 4000);
});

// --------------------
// Exercise 3: Resolve & Reject
// --------------------
const pResolved = Promise.resolve(3); // resolves with value 3
const pRejected = Promise.reject("Boo!"); // rejects with "Boo!"

// --------------------
// Demo helpers for the page
// --------------------
const logBox = document.getElementById("log");
const log = msg => {
  console.log(msg);
  logBox.textContent = String(msg);
};

document.getElementById("btn1").addEventListener("click", () => {
  // Example that should REJECT
  compareToTen(15)
    .then(res => log(res))
    .catch(err => log(err));

  // Example that should RESOLVE (also log to console)
  compareToTen(8)
    .then(res => console.log(res))
    .catch(err => console.log(err));
});

document.getElementById("btn2").addEventListener("click", () => {
  log("Waiting 4 seconds...");
  delayedSuccess.then(res => log(res));
});

document.getElementById("btn3").addEventListener("click", () => {
  pResolved.then(v => console.log("Resolved with:", v));
  pRejected.catch(e => console.log("Rejected with:", e));
  log("Check console for resolve/reject outputs.");
});

// Export (optional, useful for Node tests)
if (typeof module !== "undefined") {
  module.exports = { compareToTen, delayedSuccess, pResolved, pRejected };
}
