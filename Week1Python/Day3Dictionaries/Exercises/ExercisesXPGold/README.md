# 🥈 Python Practice — Birthdays & Fruit Shop

<!-- NOVA:ULTIMATE:START -->
<div align="center">

<img src="../../../../assets/readme/nova-folder-pulse.svg" width="100%" alt="Animated NOVA learning pulse">

### Exercises XPGold

<img src="../../../../assets/readme/progress/exercises-xpgold-dd00d1c574.svg" width="100%" alt="Readiness status for Exercises XPGold">

**Goal:** Reinforce the lesson with intermediate scenarios, validation, and stronger edge-case handling.

</div>

## 🧭 NOVA Folder Guide

| Metric | Value |
|---|---:|
| Readiness | **80%** |
| Files | 3 |
| Source files | 1 |
| Test files | 0 |
| Text lines | 190 |

### ▶️ Main paths

- `Week1Python/Day3Dictionaries/Exercises/ExercisesXPGold/exercisesxpgold.py`

### 🚀 Run

```bash
python Week1Python/Day3Dictionaries/Exercises/ExercisesXPGold/exercisesxpgold.py
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

Two tiny console exercises: a birthday lookup (with optional insert) and a fruit shop inventory cost calculator. Code is kept simple with small comments.

> ▶️ Run with **Python 3.10+**. No extra packages required.

---

## 🚀 How to run

```bash
python exercisesxpgold.py
```
Execute the exercises via `exercisesxpgold.py`. The interactive flow now lives behind `_cli()`, so importing the module exposes pure helpers without triggering prompts.

Birthdays still ask for input when you run the CLI; the fruit shop section only prints results.

---

## 🎂 Exercise 1–3 — Birthdays

**🎯 Goal:** store some birthdays, optionally add a new person, show the names list, and look up one birthday.

**📊 Data shape:**
```python
birthdays = {
    "Alice": "1995/06/12",
    "Bob": "1990/01/23",
    # ...
}
```

**Key helpers:**
- `add_birthday(birthdays, name, date)` returns a new dictionary with the extra entry.
- `lookup_birthday(birthdays, name)` returns the stored date or `None`.

**Typical flow:**
1. Print a welcome message.
2. Print all names with `", ".join(birthdays.keys())`.
3. Ask the user to add a new name (press Enter to skip); use `add_birthday` if provided.
4. Show names again so the addition is visible.
5. Ask **who** to look up; call `lookup_birthday` and display the result.

**Example run (one possible flow):**
```
Welcome! You can look up the birthdays of the people in the list.
Names: Alice, Bob, Charlie, Dana, Eli
Add a name (or press Enter to skip): Kevin
Enter birthday (YYYY/MM/DD): 1994/06/16
Names: Alice, Bob, Charlie, Dana, Eli, Kevin
Who do you want to look up? Kevin
Kevin's birthday is 1994/06/16
```

**Notes:**
- Date format is treated as plain text (no validation here).
- Keys are case‑sensitive (`"alice"` ≠ `"Alice"`).
- To avoid duplicates, you can check `if new_name in birthdays` before inserting.
- Time complexity: all operations shown are **O(n)** or better for these tiny tasks.

---

## Exercise 4 — Fruit Shop

**Goal:** print item prices and compute the **total cost** to buy all stock from a nested dictionary.

Use `stock_value(items)` to handle the multiplication and summation for you:

```python
from exercisesxpgold import stock_value

inventory = {
    "banana": {"price": 4, "stock": 10},
    "apple": {"price": 2, "stock": 5},
    "orange": {"price": 1.5, "stock": 24},
    "pear": {"price": 3, "stock": 1},
}

stock_value(inventory)
# -> 162.0
```

**Notes:**
- Multiplying `price * stock` gives the cost to clear that item.
- The helper assumes `price` and `stock` exist for each item; add guards if your data is messy.
- Wrap the result in your preferred formatting function if you need currency output.

---

## Tips for my future self
- For the birthdays dict, consider validating dates with `datetime.strptime`.
- Normalize names (e.g., `.title()`) to reduce case mismatches.
- For the fruit shop, guard against missing keys with `dict.get` or `try/except`.
- The helpers are already unit-test friendly; the CLI remains only for parity with the original instructions.

---

## License
MIT — free to use, copy, and modify.
---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/Lirioth/Fullstack2026)  
Week 1 Day 3 - Exercises XP Gold

---

*Happy coding!* 🐍✨
