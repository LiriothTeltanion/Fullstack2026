# 🥇 Exercises XP Gold

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xpgold-a6b0421da4.svg" width="100%" alt="Progress card for Exercises XPGold">

</div>

Three short exercises with variables, conditionals, loops and objects. The script runs as soon as the page loads.

## ▶️ How to run

Open `index.html` in a browser (or use `npm run dev` from the repo root) and open DevTools → Console. Exercise 2 shows a `prompt()`, so it only works in a browser.

```
Exercise 1: Divisible by 3?
true
true
true
true
false

Exercise 3: Playing with numbers
Sum: 233
Highest age: 98
```

## 🎯 The challenge

1. **Divisible by three** – loop over `[123, 8409, 100053, 333333333, 7]` and log `n % 3 === 0`.
2. **Attendance** – ask for a name; if it is in `guestList` (checked with `in`, after `trim()` and `toLowerCase()`) it logs and alerts `Hi! I'm randy, and I'm from Germany.`, otherwise `Hi! I'm a guest.`
3. **Playing with numbers** – sum the `age` array and find the highest value with plain `for` loops, without `Math.max` or `reduce`.

More notes are in [README_JS_XP_Gold.md](README_JS_XP_Gold.md).

## 🧠 What I learned

- The `%` operator tells me if a number divides evenly
- The `in` operator checks if an object has a key
- Finding the maximum by hand means starting with the first item and comparing the rest
- Wrapping each exercise in `{ }` keeps its `const` names from clashing

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 3 Day 1 - Introduction to JavaScript - Exercises XP Gold
