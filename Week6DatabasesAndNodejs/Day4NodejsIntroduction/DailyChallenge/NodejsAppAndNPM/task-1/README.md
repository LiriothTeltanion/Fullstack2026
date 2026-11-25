# 🧪 Task 1 - Basic Module System

<div align="center">

<img src="../../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../../assets/readme/progress/task-1-ea89997211.svg" width="100%" alt="Progress card for Task 1">

</div>

Task 1 of the daily challenge: use the `greet()` function from the shared [`greeting.js`](../greeting.js) module.

## ▶️ How to run

```bash
node app.js
```

It prints the title `🧪 Task 1 — Basic Module System`, `Hello, Kevin! 👋`, a second greeting, and `Hello, friend! 👋` for the empty name. No npm packages are needed.

## 🎯 The challenge

- `app.js` loads the module with `const { greet } = require("../greeting")` and calls it three times.
- `greet(name)` trims the name and uses `friend` when it is empty or not a string.

## 🧠 What I learned

- Destructuring picks one function out of `module.exports`
- `..` in a `require` path goes one folder up
- A fallback value keeps the function safe with bad input

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 6 Day 4 - Introduction to Node.js - Task 1
