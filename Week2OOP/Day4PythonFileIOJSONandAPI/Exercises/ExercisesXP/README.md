# Files & JSON XP – Combined Solutions ✨

<!-- NOVA:ULTIMATE:START -->
<div align="center">

<img src="../../../../assets/readme/nova-folder-pulse.svg" width="100%" alt="Animated NOVA learning pulse">

### Exercises XP

<img src="../../../../assets/readme/progress/exercises-xp-7736123bb3.svg" width="100%" alt="Readiness status for Exercises XP">

**Goal:** Build resilient asynchronous flows with HTTP requests, loading states, validation, and error handling.

</div>

## 🧭 NOVA Folder Guide

| Metric | Value |
|---|---:|
| Readiness | **80%** |
| Files | 3 |
| Source files | 1 |
| Test files | 0 |
| Text lines | 207 |

### ▶️ Main paths

- `Week2OOP/Day4PythonFileIOJSONandAPI/Exercises/ExercisesXP/xp_files_json_all.py`

### 🚀 Run

```bash
python Week2OOP/Day4PythonFileIOJSONandAPI/Exercises/ExercisesXP/xp_files_json_all.py
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

This folder contains a single script, `xp_files_json_all.py`, that solves the two Files & JSON XP tasks:

1. **Random Sentence Generator** – builds a sentence of user-defined length by reading from `words.txt`.
2. **JSON Manipulation** – reads a sample employee record, displays the salary, adds a `birth_date`, and saves the updated data.

`words.txt` is created automatically the first time the script runs (with a small default list) so you can launch the exercises immediately. Feel free to edit the file to include your own vocabulary.

---

## ✅ Requirements

- Python **3.10+** (standard library only)

---

## ▶️ Quick Demo

From this directory run:

```bash
python xp_files_json_all.py
```

The script will:

- Generate a lowercase random sentence with 6 words.
- Display the original salary stored in the JSON payload.
- Save the modified data to `modified_employee.json` in the same folder.

---

## 🧑‍💻 Interactive Sentence Generator

To use the interactive prompt from Exercise 1, import and call `main()`:

```python
from xp_files_json_all import main
main()  # Follow the on-screen instructions 😊
```

Valid input is an integer between **2 and 20** (inclusive). The words are sourced from `words.txt` every time you run the generator, so updates to the file are reflected automatically.

---

## 📦 Output Files

- `modified_employee.json` – Created after the JSON exercise runs, containing the additional `"birth_date"` field.
- `words.txt` – Auto-generated on first run if missing; you may customize it anytime.

Enjoy exploring both exercises in one place! 🐍💙
