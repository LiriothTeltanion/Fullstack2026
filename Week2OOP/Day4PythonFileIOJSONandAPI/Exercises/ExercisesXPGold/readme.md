# Exercises XP Gold — Classes/Objects + Files + Giphy API 🤹‍♀️

<!-- NOVA:ULTIMATE:START -->
<div align="center">

<img src="../../../../assets/readme/nova-folder-pulse.svg" width="100%" alt="Animated NOVA learning pulse">

### Exercises XPGold

<img src="../../../../assets/readme/progress/exercises-xpgold-f50d6cc9c3.svg" width="100%" alt="Readiness status for Exercises XPGold">

**Goal:** Build resilient asynchronous flows with HTTP requests, loading states, validation, and error handling.

</div>

## 🧭 NOVA Folder Guide

| Metric | Value |
|---|---:|
| Readiness | **80%** |
| Files | 6 |
| Source files | 3 |
| Test files | 0 |
| Text lines | 344 |

### ▶️ Main paths

- `Week2OOP/Day4PythonFileIOJSONandAPI/Exercises/ExercisesXPGold/giphyexercises.py`
- `Week2OOP/Day4PythonFileIOJSONandAPI/Exercises/ExercisesXPGold/menueditor.py`
- `Week2OOP/Day4PythonFileIOJSONandAPI/Exercises/ExercisesXPGold/menumanager.py`

### 🚀 Run

```bash
python Week2OOP/Day4PythonFileIOJSONandAPI/Exercises/ExercisesXPGold/giphyexercises.py
python Week2OOP/Day4PythonFileIOJSONandAPI/Exercises/ExercisesXPGold/menueditor.py
python Week2OOP/Day4PythonFileIOJSONandAPI/Exercises/ExercisesXPGold/menumanager.py
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
- `menumanager.py` — data layer for the Restaurant Menu Manager (JSON I/O + add/remove).
- `menueditor.py` — UI loop that only calls `MenuManager` methods (encapsulation honored).
- `restaurantmenu.json` — seeded with the provided menu.
- `giphyexercises.py` — solutions for Giphy API #1 and #2 (requests + f-strings + filters).

## Exercise 1 — Restaurant Menu Manager
Run the UI:
```bash
python menueditor.py
```
- Shows a small menu, lets you **show**, **add**, **remove**, then **save & exit**.
- The UI knows nothing about the JSON path; `MenuManager` encapsulates file I/O.
- Changes persist to `restaurantmenu.json` when you choose **Save & Exit**.

## Exercise 2 — Giphy API #1
What it does:
- Builds the URL with **f-strings** and variables.
- Fetches `q=hilarious` with `rating=g`.
- Returns JSON when status code = 200.
- Filters GIFs to **height > 100**, returns **length** of that filtered set, and only the **first 10** items.

Try it from the helper demo:
```bash
python giphyexercises.py
```
(The script prints the total filtered count and the first 10 IDs.)

## Exercise 3 — Giphy API #2
From the same `giphyexercises.py`, it will ask for a search term:
- If empty, or if the search yields no results / API error, it returns **trending** GIFs and notes the fallback.
- Uses the provided API key.

---

> All code comments include emojis as requested. Enjoy! ✅
