# Exercises XP Ninja — OOP + RegEx 🥷

<!-- NOVA:ULTIMATE:START -->
<div align="center">

<img src="../../../../assets/readme/nova-folder-pulse.svg" width="100%" alt="Animated NOVA learning pulse">

### Exercises XPNinja

<img src="../../../../assets/readme/progress/exercises-xpninja-5c88e8c55d.svg" width="100%" alt="Readiness status for Exercises XPNinja">

**Goal:** Build resilient asynchronous flows with HTTP requests, loading states, validation, and error handling.

</div>

## 🧭 NOVA Folder Guide

| Metric | Value |
|---|---:|
| Readiness | **80%** |
| Files | 6 |
| Source files | 3 |
| Test files | 0 |
| Text lines | 395 |

### ▶️ Main paths

- `Week2OOP/Day4PythonFileIOJSONandAPI/Exercises/ExercisesXPNinja/charactersgame.py`
- `Week2OOP/Day4PythonFileIOJSONandAPI/Exercises/ExercisesXPNinja/ninjamenueditor.py`
- `Week2OOP/Day4PythonFileIOJSONandAPI/Exercises/ExercisesXPNinja/ninjamenumanager.py`

### 🚀 Run

```bash
python Week2OOP/Day4PythonFileIOJSONandAPI/Exercises/ExercisesXPNinja/charactersgame.py
python Week2OOP/Day4PythonFileIOJSONandAPI/Exercises/ExercisesXPNinja/ninjamenueditor.py
python Week2OOP/Day4PythonFileIOJSONandAPI/Exercises/ExercisesXPNinja/ninjamenumanager.py
```

### 🟢 What is already strong

- ✅ README documentation is generated and repeatable.
- ✅ Contains 3 source file(s) across practical exercises or projects.
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

Deliverables (lowercase, no underscores), with **emoji-rich comments**:
- `ninjamenumanager.py` — data layer for the Valentine Menu rules (regex validation + heart ASCII).
- `ninjamenueditor.py` — UI that calls only the manager’s methods (encapsulation).
- `restaurantmenu.json` — seeded menu with an empty `valentines` list.
- `charactersgame.py` — D&D character generator (4d6 drop lowest) with JSON/TXT exports.

## Exercise 1 — Restaurant Menu Manager (RegEx + Valentine)
Run the UI:
```bash
python ninjamenueditor.py
```
Features:
- **Show menu** prints a star **heart** and lists regular + Valentine items.
- **Add Valentine item** validates:
  - First word starts with **V**, connection words (of/the/and/…) are **lowercase**.
  - Name has **≥ 2 “e”**, and **no digits**.
  - Price matches **`XX,14`** (e.g., `23,14`).
- On success, the item is appended to `valentines` and saved to JSON immediately.

## Exercise 2 — Dungeons & Dragons
Run:
```bash
python charactersgame.py
```
- Asks number of players, then **name** and **age** for each.
- Rolls **4d6 drop lowest** for the six stats.
- Exports:
  - `characters.json` — structured data
  - `characters.txt` — nicely formatted sheet

Enjoy, and may the dice be ever in your favor. 🎲❤️
