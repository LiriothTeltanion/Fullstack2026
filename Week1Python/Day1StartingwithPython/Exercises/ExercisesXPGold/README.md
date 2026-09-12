# 🥇 Exercises XP Gold — String Repetition and Seasons

## 🛰️ Bounded evidence checkpoint — 2026-09-11

<div align="center">

<img src="../../../../assets/readme/days/week1-day1-python-foundations.svg" width="100%" alt="Week 1 Day 1 Python foundations evidence map: XP 1–9, Gold 1–2, and Ninja 1–5 are repository-verified by 23 focused tests; the Daily Challenge matches the reviewed official prompt and passes 5 focused tests; learning and Octopus submission remain unverified.">

</div>

| Evidence layer | State | What is supported |
|---|---|---|
| XP Gold 1–2 repository behavior | `VERIFIED` | [Six focused tests](../../../../tests/python/test_week1_day1_exercises_xp_gold.py) cover exact repeated output, all 12 month mappings, seasonal transitions, invalid values, and interactive retries. |
| XP Ninja 1–5 repository behavior | `VERIFIED` | The [Ninja guide](../ExercisesXPNinja/) and [seven-test suite](../../../../tests/python/test_week1_day1_exercises_xp_ninja.py) cover the newly reviewed tier. |
| Daily Challenge | `VERIFIED` requirement alignment and repository behavior | A read-only source comparison plus [five tests](../../../../tests/python/test_week1_day1_daily_challenge.py) cover the official behavior. |
| Kevin's understanding | `UNVERIFIED` | Requires Kevin's own explanation, a changed example, independent recreation, and an edge case. |
| Octopus submission or grade | `UNVERIFIED` | No submission, instructor review, completion, or grade is asserted here. |

Full commands and evidence boundary: [Gold record](../../../../.learning/evidence/2026-09-11-week1-day1-exercises-xp-gold.md) · [Ninja record](../../../../.learning/evidence/2026-09-11-week1-day1-exercises-xp-ninja.md) · [Daily alignment record](../../../../.learning/evidence/2026-09-11-week1-day1-daily-challenge-alignment.md).

<details>
<summary>Historical repository snapshot — generated 2026-07-15</summary>

<!-- NOVA:ULTIMATE:START -->
<div align="center">

### Exercises XPGold

**Goal:** Practice Python basics, string repetition, numeric input, and conditional season mapping.

</div>

## 🧭 NOVA Folder Guide

| Metric | Value |
|---|---:|
| Historical readiness heuristic | **80% · generated 2026-07-15** |
| Files | 3 |
| Source files | 1 |
| Colocated test files | 0; one focused Gold suite now lives under `tests/python/` |
| Text lines | 272 |

### ▶️ Main paths

- `Week1Python/Day1StartingwithPython/Exercises/ExercisesXPGold/exercisesxpgold.py`

### 🚀 Run

```bash
python Week1Python/Day1StartingwithPython/Exercises/ExercisesXPGold/exercisesxpgold.py
```

### 🟢 What is already strong

- ✅ README documentation is generated and repeatable.
- ✅ Contains 1 source file(s) across practical exercises or projects.
- ✅ No Python syntax error was detected in this folder tree.
- ✅ A likely runnable entry point was detected.
- ✅ Six centralized tests now cover the two supplied XP Gold behaviors.

### 🟠 What to improve next

- ⚠️ Kevin's independent explanation and Octopus submission state remain unverified.

### 🧪 Validation

```bash
python tools/nova_quality_gate.py --repo . --strict
python -m unittest discover -s tests/python -p "test_*.py" -v
node tools/run_node_tests.mjs .
```

> The readiness value is a transparent repository heuristic, not a course grade and not proof that every interactive or external-API exercise was executed.

<sub>Managed by NOVA Ultimate v2.0.0 · 2026-07-15T06:22:49+03:00</sub>
<!-- NOVA:ULTIMATE:END -->

</details>

**Author:** Kevin Cusnir<br>
**Creative signature:** Lirioth Teltanion<br>
**Course:** Fullstack Bootcamp 2026<br>
**Local README originally updated:** October 18, 2025<br>
**Source requirements last updated:** February 5, 2026<br>
**Repository alignment reviewed:** September 11, 2026

**Practice two focused Python fundamentals with exact output and a tested input boundary.**

## 📊 Quick Stats
- **⏰ Duration**: 30-45 minutes
- **🎯 Difficulty**: 🟢 Beginner
- **📝 Exercises**: 2
- **✅ Suggested preparation**: Review ExercisesXP

## 🎯 Learning Objectives

These exercises are designed to help you practice how to:
- ✅ Use string multiplication for concise repeated output
- ✅ Apply tuple membership testing for categorization
- ✅ Implement month-to-season mapping logic
- ✅ Create robust input validation systems
- ✅ Use constants for cleaner, maintainable code

---

## 📋 **Exercise Overview**

| Exercise | Topic | Key Technique | Interactive |
|----------|-------|---------------|-------------|
| 1 | String multiplication | `"text\n" * n` | ❌ No |
| 2 | Season mapper | Tuple membership `in` | ✅ Yes |

---

## 1️⃣ Exercise 1: Hello World — I love Python (one line)
**🎯 Goal:** print multiple lines using **string multiplication** and `\n` newlines in a single statement.

What happens:
- `"Hello world\n"*4` → repeats `Hello world` 4 times, each with a newline.
- `"I love python\n"*3 + "I love python"` → prints the sentence 3 times with newlines, then once more without a trailing `\n` (so the output ends cleanly).

> 💡 Tip: This avoids writing many `print(...)` calls. Great for learning how strings combine.

## 2️⃣ Exercise 2: What is the Season?
**🎯 Goal:** read a **month number** (1–12) and print the **season**.

How it works (simple membership checks):
```python
if m in (3, 4, 5):
    return "Spring"
elif m in (6, 7, 8):
    return "Summer"
elif m in (9, 10, 11):
    return "Autumn"
elif m in (12, 1, 2):
    return "Winter"
else:                   # Outside the helper's 1..12 contract
    raise ValueError("month must be between 1 and 12")
```

### 📸 Examples
```
Enter month (1-12): 4
Spring

Enter month (1-12): 8
Summer

Enter month (1-12): 12
Winter

Enter month (1-12): 0
Month must be between 1 and 12.
Enter month (1-12): 4
Spring
```

---

## 📚 **Code Structure**

The `exercisesxpgold.py` file contains:
- **Constants**: Season month tuples for cleaner logic
- **2 exercise functions**: String multiplication and season detection
- **Helper function**: `get_valid_month()` for validated input (1-12)
- **Season mapper**: `get_season()` returns exact plain-text season names and rejects values outside 1–12

### 🔍 **Function Map**
```python
exercise_1_hello_world()  → String multiplication demo
get_valid_month()         → Input validation (1-12)
get_season()              → Month → Season mapper
exercise_2_season()       → Interactive season finder
```

---

## ▶️ How to run
### Option A — Double click (if `.py` files run with Python on your OS)
- Save as `exercisesxpgold.py` and double click.

### Option B — Terminal / Command Prompt
```bash
# macOS / Linux
python3 exercisesxpgold.py

# Windows
python exercisesxpgold.py
# or
py exercisesxpgold.py
```

---

## 📁 Files
- `exercisesxpgold.py` — Requirement-aligned implementation
- `README.md` — This documentation
- `../../../../tests/python/test_week1_day1_exercises_xp_gold.py` — Central focused regression suite

---

## 🐛 Troubleshooting

### Common Issues & Solutions

**❌ Problem:** Month validation not working  
**✅ Solution:** Code includes `get_valid_month()` with input validation (1-12)

**❌ Problem:** Seasons don't match expected months  
**✅ Solution:** Verify month mappings:
- Spring: March (3), April (4), May (5)
- Summer: June (6), July (7), August (8)
- Autumn: September (9), October (10), November (11)
- Winter: December (12), January (1), February (2)

**❌ Problem:** `ValueError: invalid literal for int()`  
**✅ Solution:** Input validation catches this automatically. Enter numbers only.

**❌ Problem:** String multiplication output unexpected  
**✅ Solution:** Check newline characters (`\n`) - they create new lines in output

---

## 💡 Learning Tips

1. **Experiment with string operators** - Try `"test" * 5` in Python shell
2. **Understand tuple membership** - `if x in (1, 2, 3):` is cleaner than multiple `or`
3. **Use constants** - `SPRING_MONTHS = (3, 4, 5)` makes code more maintainable
4. **Practice input validation** - The `get_valid_month()` pattern is reusable

---

## 👤 About the Author

**Kevin Cusnir · Lirioth Teltanion**

- 🎓 Fullstack Developer Student
- 💻 GitHub: [@LiriothTeltanion](https://github.com/LiriothTeltanion)
- 📦 Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)

---

**Created for careful, beginner-friendly Python practice with transparent evidence boundaries.**
