# 🗡️ Exercises XP Ninja — JS Basics

Mini-solution covering **Variables, Conditionals, Loops, and Functions** with two exercises: BMI comparison and Grade Average.  
Neutral tone; emojis to make scanning easier. ✨

---

## 📦 Files
- `index.js` — all code with clear emoji comments.

---

## 🚀 Run (Node.js)
```bash
node index.js
```

**Output (example):**
```
— Exercise 1 — BMI —
🏆 Bob Sample has the larger BMI: 26.23 vs 23.53

— Exercise 2 — Grades —
📏 Average: 78.60
✅ Passed with average: 78.60
📏 Average: 51.67
❌ Failed with average: 51.67 — must repeat the course.
```

---

## 🧠 Exercise 1 — BMI
- Two objects, each with:
  - `fullName`, `massKg`, `heightM`
  - `bmi()` method → returns BMI = mass / height²
- `compareBmi(p1, p2)` → logs who has the larger BMI (or tie).

---

## 🎓 Exercise 2 — Grade Average
- `findAvg(gradesList)` → computes and logs the average, then prints pass/fail (`> 65` = pass).
- Bonus split:
  - `computeAverage(gradesList)` → returns numeric average.
  - `reportPassFail(avg)` → prints pass/fail message.
  - `findAvg()` calls both (as required).

---

## 🧪 Quick tweaks
- Change the sample people or grades in `index.js` to test different scenarios.
