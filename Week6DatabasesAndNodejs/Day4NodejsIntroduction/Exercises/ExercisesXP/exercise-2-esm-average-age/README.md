# 🧪 Exercise 2 - ESM Average Age

<div align="center">

<img src="../../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../../assets/readme/progress/exercise-2-esm-average-age-c4dc30ec36.svg" width="100%" alt="Progress card for Exercise 2 esm average age">

</div>

A list of people exported as an ES module, and a script that imports it and prints their average age.

## ▶️ How to run

```bash
node app.js
```

```
🧠 Average age across 4 people: 29
```

## 🎯 The challenge

| File | What it does |
|---|---|
| `data.js` | `export const people`: four people with `name`, `age` and `location` |
| `app.js` | `import { people } from "./data.js"`. `averageAge(arr)` adds the ages with `reduce`, divides by the count and rounds to two decimals; an empty list prints a warning and returns 0. |

`package.json` has `"type": "module"`, which lets Node read `import` and `export` in `.js` files.

## 🧠 What I learned

- `"type": "module"` switches a package to ES modules
- ES module imports need the file extension (`./data.js`)
- `reduce` turns a list into one value, like a sum
- Checking for an empty array avoids dividing by zero

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 6 Day 4 - Introduction to Node.js - Exercise 2
