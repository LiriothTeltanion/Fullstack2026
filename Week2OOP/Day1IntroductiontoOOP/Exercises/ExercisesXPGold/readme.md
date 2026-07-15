# Exercises XP Gold — Single-File Solutions 🧠🐍

<!-- NOVA:ULTIMATE:START -->
<div align="center">

<img src="../../../../assets/readme/nova-folder-pulse.svg" width="100%" alt="Animated NOVA learning pulse">

### Exercises XPGold

<img src="../../../../assets/readme/progress/exercises-xpgold-8f60c9c51e.svg" width="100%" alt="Readiness status for Exercises XPGold">

**Goal:** Reinforce the lesson with intermediate scenarios, validation, and stronger edge-case handling.

</div>

## 🧭 NOVA Folder Guide

| Metric | Value |
|---|---:|
| Readiness | **80%** |
| Files | 3 |
| Source files | 1 |
| Test files | 0 |
| Text lines | 224 |

### ▶️ Main paths

- `Week2OOP/Day1IntroductiontoOOP/Exercises/ExercisesXPGold/exercisesxpgold.py`

### 🚀 Run

```bash
python Week2OOP/Day1IntroductiontoOOP/Exercises/ExercisesXPGold/exercisesxpgold.py
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

Everything is in **one Python file**: `exercisesxpgold.py` + this `readme.md`.  
Comments and docstrings are in **English**. Emojis included where useful. ✨

## What’s inside
- ⭕ **Circle** — `perimeter()`, `area()`, `describe()`
- 🔤 **MyList** — `reversed_list()`, `sorted_list()`, bonus `random_numbers_like()`
- 🍽️ **MenuManager** — `add_item`, `update_item`, `remove_item`, `print_menu`

### Spice levels (MenuManager)
- A = not spicy  
- B = a little spicy  
- C = very spicy 🌶️

## How to run
```bash
python exercisesxpgold.py   # runs small demos for all classes
```

## Quick import examples
```python
from exercisesxpgold import Circle, MyList, MenuManager

c = Circle(2.5)
print(round(c.perimeter(), 2), round(c.area(), 2))

ml = MyList(["b","A","c"])
print(ml.reversed_list(), ml.sorted_list(), ml.random_numbers_like(1, 3))

mm = MenuManager()
mm.add_item("Falafel", 12, "A", False)
mm.update_item("Soup", 11, "B", False)
mm.remove_item("Hamburger")
```
Enjoy! 💙
