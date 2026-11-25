# 🧪 Exercise 3 - Calculator

<div align="center">

<img src="../../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../../assets/readme/progress/exercise3-calculator-3705d63715.svg" width="100%" alt="Progress card for Exercise3 calculator">

</div>

A pocket calculator: the four operations, a sign key, percent, and the memory keys `M+`, `M-`, `MR` and `MC`.

## ▶️ How to run

Open `index.html` in a browser (or run `npm run dev` from the repo root and go to `http://localhost:8000/Week3JavaScriptandDOM/RemoteLearningJSAndDOM/Exercises/ExercisesXP1/exercise3_calculator/`). `js/app.js` needs the page, so it does not run with `node`.

```
7 + 5 × 2 =   →  24   (each operator works on the running total)
9 ÷ 0 =       →  NaN
```

## 🎯 The challenge

| Function | What it does |
|---|---|
| `inputDigit(ch)` | Starts a new number or adds a digit; a second `.` is ignored. |
| `doOp(next)` | Applies the pending operator to the running total `acc`, then stores the next one. |
| `compute(x, y, op)` | Does `+`, `-`, `*` and `/`; dividing by 0 returns `NaN`. |
| `equals()` | Finishes the pending operation and shows the result. |
| `clearAll()`, `toggleSign()`, `percent()` | The `C`, `±` and `%` keys. |
| `mplus()`, `mminus()`, `mr()`, `mc()` | Add to, subtract from, recall and clear the memory. |

When a result is longer than 14 characters, `setDisplay()` switches to scientific notation so it still fits. The keypad has one click listener that reads `data-num`, `data-op` and `data-act` to know which button was pressed.

It works like a cheap desk calculator, left to right, so it doesn't follow math precedence.

## 🧠 What I learned

- The whole calculator runs on three variables: `acc`, the pending `op` and a `fresh` flag for "next digit starts a new number"
- Thanks to the `data-*` attributes, one listener on `.keys` is enough for all the buttons
- The `switch` in `compute()` puts all four operations in one short place
- Because each operator uses the running total, `7 + 5 × 2` gives 24 instead of 17

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 3 Remote Learning - JavaScript and the DOM - Exercise 3
