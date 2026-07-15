# Exercises XP Gold — DOM & Forms

<!-- NOVA:ULTIMATE:START -->
<div align="center">

<img src="../../../../assets/readme/nova-folder-pulse.svg" width="100%" alt="Animated NOVA learning pulse">

### Exercises XPGold

<img src="../../../../assets/readme/progress/exercises-xpgold-e35a4208fd.svg" width="100%" alt="Readiness status for Exercises XPGold">

**Goal:** Create interactive browser experiences with JavaScript, DOM events, accessibility, and responsive behavior.

</div>

## 🧭 NOVA Folder Guide

| Metric | Value |
|---|---:|
| Readiness | **80%** |
| Files | 4 |
| Source files | 2 |
| Test files | 0 |
| Text lines | 171 |

### ▶️ Main paths

- `Week3JavaScriptandDOM/Day3LearningDOMEvents/Exercises/ExercisesXPGold/index.html`

### 🚀 Run

```bash
python -m http.server 8000
```

### 🟢 What is already strong

- ✅ README documentation is generated and repeatable.
- ✅ Contains 2 source file(s) across practical exercises or projects.
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

**Last Updated:** October 7th, 2025

## What we will learn
- Working with the DOM 🧩
- Event Handlers 🖱️
- Forms 📝

## Files
- `index.html` — contains a single `<div id="root"></div>`. All UI is created from JS. ✨
- `index.js` — implementations for the three exercises.

## Run
Open `index.html` in a browser.

## Exercises
1) Select a kind of Music 🎵 — shows the selected value; adds `Classic` and selects it by default.
2) Delete colors 🎨 — button calls `removecolor()` to remove the selected color.
3) Shopping list 🛒 — `shoppingList` array; `addItem()` and `clearAll()` buttons; items render in a list.
