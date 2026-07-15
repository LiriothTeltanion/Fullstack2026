# Exercises XP — Promises

<!-- NOVA:ULTIMATE:START -->
<div align="center">

<img src="../../../../assets/readme/nova-folder-pulse.svg" width="100%" alt="Animated NOVA learning pulse">

### Exercises XP

<img src="../../../../assets/readme/progress/exercises-xp-44a220fa48.svg" width="100%" alt="Readiness status for Exercises XP">

**Goal:** Build resilient asynchronous flows with HTTP requests, loading states, validation, and error handling.

</div>

## 🧭 NOVA Folder Guide

| Metric | Value |
|---|---:|
| Readiness | **80%** |
| Files | 4 |
| Source files | 2 |
| Test files | 0 |
| Text lines | 145 |

### ▶️ Main paths

- `Week4AdvAsynchronousJavaScript/Day4AsynchronousJavaScript/Exercises/ExercisesXP/index_promises.html`
- `Week4AdvAsynchronousJavaScript/Day4AsynchronousJavaScript/Exercises/ExercisesXP/promises.js`

### 🚀 Run

```bash
python -m http.server 8000
node Week4AdvAsynchronousJavaScript/Day4AsynchronousJavaScript/Exercises/ExercisesXP/promises.js
```

### 🟢 What is already strong

- ✅ README documentation is generated and repeatable.
- ✅ Contains 2 source file(s) across practical exercises or projects.
- ✅ No Python syntax error was detected in this folder tree.
- ✅ A likely runnable entry point was detected.

### 🟠 What to improve next

- ⚠️ No local unit test is present yet; repository-wide syntax checks still cover the sources.

### 🧪 Validation

```bash
python tools/nova_quality_gate.py --repo . --strict
python -m unittest discover -s tests/python -p "test_*.py" -v
node tools/run_node_tests.mjs .
```

> The readiness value is a transparent repository heuristic, not a course grade and not proof that every interactive or external-API exercise was executed.

<sub>Managed by NOVA Ultimate v2.0.0 · 2026-07-15T06:22:49+03:00</sub>
<!-- NOVA:ULTIMATE:END -->

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
