# 🥈 Exercises XP Gold - Enhanced Practice

<!-- NOVA:ULTIMATE:START -->
<div align="center">

<img src="../../../../assets/readme/nova-folder-pulse.svg" width="100%" alt="Animated NOVA learning pulse">

### Exercises XPGold

<img src="../../../../assets/readme/progress/exercises-xpgold-d14a8c80ec.svg" width="100%" alt="Readiness status for Exercises XPGold">

**Goal:** Reinforce the lesson with intermediate scenarios, validation, and stronger edge-case handling.

</div>

## 🧭 NOVA Folder Guide

| Metric | Value |
|---|---:|
| Readiness | **80%** |
| Files | 3 |
| Source files | 1 |
| Test files | 0 |
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

**Author:** Kevin Cusnir "Lirioth"  
**Course:** Fullstack Bootcamp 2026  
**Last Updated:** October 18, 2025

**Reinforce Python fundamentals with real-world scenarios and advanced string techniques.**

## 📊 Quick Stats
- **⏰ Duration**: 30-45 minutes
- **🎯 Difficulty**: 🟡 Intermediate
- **📝 Exercises**: 2
- **✅ Prerequisites**: Completed ExercisesXP

## 🎯 Learning Objectives

By completing these exercises, you will:
- ✅ Master string multiplication for efficient output
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
if m in (3, 4, 5):      # 🌸 Spring
elif m in (6, 7, 8):    # ☀️ Summer
elif m in (9, 10, 11):  # 🍂 Autumn
elif m in (12, 1, 2):   # ❄️ Winter
else:                   # Anything not 1..12
    print("Invalid month")
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
Invalid month
```

---

## 📚 **Code Structure**

The `exercisesxpgold.py` file contains:
- **Constants**: Season month tuples for cleaner logic
- **2 exercise functions**: String multiplication and season detection
- **Helper function**: `get_valid_month()` for validated input (1-12)
- **Season mapper**: `get_season()` returns emoji-enhanced season names

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
- `exercisesxpgold.py` — Complete implementation
- `README.md` — This documentation

---

## � Troubleshooting

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

## �👤 About the Author

**Kevin Cusnir "Lirioth"**  
- 🎓 Fullstack Developer Student  
- 💻 GitHub: [@Lirioth](https://github.com/Lirioth)  
- 📧 Repository: [Fullstack2026](https://github.com/Lirioth/Fullstack2026)

---

**Created with ❤️ for intermediate Python practice**
