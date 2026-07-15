# Exercises XP Gold — Modules 🧠📦

<!-- NOVA:ULTIMATE:START -->
<div align="center">

<img src="../../../../assets/readme/nova-folder-pulse.svg" width="100%" alt="Animated NOVA learning pulse">

### Exercises XPGold

<img src="../../../../assets/readme/progress/exercises-xpgold-58bc95ca32.svg" width="100%" alt="Readiness status for Exercises XPGold">

**Goal:** Reinforce the lesson with intermediate scenarios, validation, and stronger edge-case handling.

</div>

## 🧭 NOVA Folder Guide

| Metric | Value |
|---|---:|
| Readiness | **80%** |
| Files | 3 |
| Source files | 1 |
| Test files | 0 |
| Text lines | 191 |

### ▶️ Main paths

- `Week2OOP/Day3OOPandModules/Exercises/ExercisesXPGold/exercisesxpgoldmodules.py`

### 🚀 Run

```bash
python Week2OOP/Day3OOPandModules/Exercises/ExercisesXPGold/exercisesxpgoldmodules.py
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

Single-file solutions in `exercisesxpgoldmodules.py` + this `readme.md`.  
Docstrings and comments in **English**. Emojis included. ✨

## Contents
1. **Upcoming Holiday** — shows today's date and time left until the next holiday (uses `holidays` if available, otherwise a fixed-date fallback).  
2. **Space Age** — age on Earth, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune given seconds.  
3. **Regex #1** — extracts numbers from a string.  
4. **Regex #2** — validates a full name like `"John Doe"`.  
5. **Password Generator** — secure generator (6–30 chars) ensuring ≥1 digit, lower, upper, special; includes a 100-round self-test. 🔐

## Run
```bash
python exercisesxpgoldmodules.py
```
