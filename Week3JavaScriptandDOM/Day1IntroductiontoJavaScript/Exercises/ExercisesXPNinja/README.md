# 🥷 Exercises XP Ninja

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xpninja-c55cdcf506.svg" width="100%" alt="Progress card for Exercises XPNinja">

</div>

Two exercises with variables, conditionals, loops and functions: compare two people's BMI and check if a grade average passes.

## ▶️ How to run

`index.js` is a CommonJS file (`require` / `module.exports`), but the repo root `package.json` has `"type": "module"`, so `node index.js` stops with `require is not defined`. Run a `.cjs` copy instead:

```powershell
Copy-Item index.js $env:TEMP\ninja.cjs; node $env:TEMP\ninja.cjs
```

```bash
cp index.js /tmp/ninja.cjs && node /tmp/ninja.cjs
```

```
— Exercise 1 — BMI —
🏆 Bob Sample has the larger BMI: 26.23 vs 23.53

— Exercise 2 — Grades —
📏 Average: 78.60
✅ Passed with average: 78.60
📏 Average: 51.67
❌ Failed with average: 51.67 — must repeat the course.
```

## 🎯 The challenge

| Function | What it does |
|---|---|
| `personA.bmi()` / `personB.bmi()` | Return mass ÷ height² for each person object. |
| `compareBmi(p1, p2)` | Logs who has the larger BMI (or a tie) and returns both values. |
| `computeAverage(gradesList)` | Returns the average; throws a `TypeError` for a non-array or a non-number grade. |
| `reportPassFail(avg)` | Above 65 passes, below 65 fails, exactly 65 is a borderline case. |
| `findAvg(gradesList)` | Logs the average and the pass/fail message, as the exercise asks. |

## 🧠 What I learned

- A method can use `this` to read the other properties of its object
- `toFixed(2)` returns a string, so I wrap it in `Number()` before comparing
- Splitting `findAvg` into two smaller functions makes each one easy to reuse
- The `type` field in `package.json` decides whether Node reads `.js` files as ESM or CommonJS

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 3 Day 1 - Introduction to JavaScript - Exercises XP Ninja
