# 💪 Daily Challenge - Calculator

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/calculator-ca1a1853e1.svg" width="100%" alt="Progress card for Calculator">

</div>

Two number inputs, an operation picker and a Calculate button. The result shows below, and the last five calculations stay in a small history list.

## ▶️ How to run

```bash
npm install
npm run dev
```

Vite prints a local address (usually `http://localhost:5173`); I open it in the browser.

## 🎯 The challenge

| Part | What it does |
|---|---|
| `operations` | An object with `add`, `subtract`, `multiply` and `divide`, each with its symbol and a `run(a, b)` function. The `<select>` is built from it |
| `calculate(first, second, operation)` | Returns `{ result }` or `{ error }`: empty fields, non-numbers and division by zero each get a message, and the result is rounded to 10 decimals |
| `App` | Keeps both inputs, the operation, the last output and the history in state |

The helper run with Node:

```
calculate("0.1", "0.2", "add")      -> { result: 0.3 }
calculate("7", "0", "divide")       -> { error: "You can't divide by zero." }
calculate("6", "7", "multiply")     -> { result: 42 }
calculate("", "3", "subtract")      -> { error: 'Please enter two numbers.' }
```

## 🧠 What I learned

- A lookup object of operations replaced a `switch` and also gave me the dropdown options
- Returning `{ error }` instead of throwing keeps the component code free of `try/catch`
- `0.1 + 0.2` is not exactly `0.3` in JavaScript, so I round the result
- `[line, ...history].slice(0, 5)` adds the newest line on top and drops the oldest

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 8 Day 4 - Mini-project Day - Daily Challenge
