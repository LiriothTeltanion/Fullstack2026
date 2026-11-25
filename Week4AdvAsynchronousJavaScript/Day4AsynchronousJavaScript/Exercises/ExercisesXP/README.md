# Exercises XP — Promises

## Files
- `index_promises.html` — Minimal UI to run and see outputs.
- `promises.js` — All exercises implemented (short & simple).
- `README.md` — This file.

## What’s implemented
### Exercise 1 — Comparison
```js
const compareToTen = (num) => new Promise((resolve, reject) => {
  if (num <= 10) resolve(`OK: ${num} <= 10`);
  else reject(`Error: ${num} is greater than 10`);
});
// Tests:
compareToTen(15).then(console.log).catch(console.log); // reject
compareToTen(8).then(console.log).catch(console.log);  // resolve
```

### Exercise 2 — Promises
```js
const delayedSuccess = new Promise((resolve) => {
  setTimeout(() => resolve("success"), 4000);
});
```

### Exercise 3 — Resolve & Reject
```js
const pResolved = Promise.resolve(3);
const pRejected = Promise.reject("Boo!");
```

## How to run
### Browser
1. Open `index_promises.html`.
2. Open DevTools → **Console**.
3. Click the buttons to run each exercise.

### Node (optional)
```bash
node -e "const {compareToTen, delayedSuccess, pResolved, pRejected}=require('./promises.js'); compareToTen(8).then(console.log); compareToTen(15).catch(console.log); pResolved.then(console.log); pRejected.catch(console.log); delayedSuccess.then(console.log);"
```

## Notes
- Exercise 2 uses a 4-second delay by requirement.
