# 🗡️ Exercises XP Ninja — JS Basics

<!-- NOVA:ULTIMATE:START -->
<div align="center">

<img src="../../../../assets/readme/nova-folder-pulse.svg" width="100%" alt="Animated NOVA learning pulse">

### Exercises XPNinja

<img src="../../../../assets/readme/progress/exercises-xpninja-c55cdcf506.svg" width="100%" alt="Readiness status for Exercises XPNinja">

**Goal:** Create interactive browser experiences with JavaScript, DOM events, accessibility, and responsive behavior.

</div>

## 🧭 NOVA Folder Guide

| Metric | Value |
|---|---:|
| Readiness | **80%** |
| Files | 3 |
| Source files | 1 |
| Test files | 0 |
| Text lines | 178 |

### ▶️ Main paths

- `Week3JavaScriptandDOM/Day1IntroductiontoJavaScript/Exercises/ExercisesXPNinja/index.js`

### 🚀 Run

```bash
node Week3JavaScriptandDOM/Day1IntroductiontoJavaScript/Exercises/ExercisesXPNinja/index.js
```

### 🟢 What is already strong

- ✅ README documentation is generated and repeatable.
- ✅ Contains 1 source file(s) across practical exercises or projects.
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
