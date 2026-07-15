# timed challenge #2 — perfect number ✅🔢

<!-- NOVA:ULTIMATE:START -->
<div align="center">

<img src="../../../../assets/readme/nova-folder-pulse.svg" width="100%" alt="Animated NOVA learning pulse">

### Timed Challenge2

<img src="../../../../assets/readme/progress/timed-challenge2-a4265f7705.svg" width="100%" alt="Readiness status for Timed Challenge2">

**Goal:** Organize practical exercises with clear goals, execution paths, validation, and improvement guidance.

</div>

## 🧭 NOVA Folder Guide

| Metric | Value |
|---|---:|
| Readiness | **80%** |
| Files | 3 |
| Source files | 1 |
| Test files | 0 |
| Text lines | 81 |

### ▶️ Main paths

- `Week1Python/Day3Dictionaries/Exercises/TimedChallenge2/perfectnumber.py`

### 🚀 Run

```bash
python Week1Python/Day3Dictionaries/Exercises/TimedChallenge2/perfectnumber.py
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

A tiny Python script that prints **True** if the given number is a *perfect number*, otherwise **False**.

- A perfect number equals the sum of its proper divisors (excluding itself).
- Examples: 6 is perfect (1 + 2 + 3 = 6); 10 is not.

## ▶️ run
```bash
python perfectnumber.py
```
Then type an integer and press **Enter**.

## 🧪 examples
```
Enter the Number:6
True

Enter the Number:10
False
```
---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/Lirioth/Fullstack2026)  
Week 1 Day 3 - Timed Challenge 2

---

*Happy coding!* 🐍✨
