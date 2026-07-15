# Exercises XP Gold — Advanced Functions

<!-- NOVA:ULTIMATE:START -->
<div align="center">

<img src="../../../../assets/readme/nova-folder-pulse.svg" width="100%" alt="Animated NOVA learning pulse">

### Exercises XPGold

<img src="../../../../assets/readme/progress/exercises-xpgold-efcef6b89a.svg" width="100%" alt="Readiness status for Exercises XPGold">

**Goal:** Create interactive browser experiences with JavaScript, DOM events, accessibility, and responsive behavior.

</div>

## 🧭 NOVA Folder Guide

| Metric | Value |
|---|---:|
| Readiness | **80%** |
| Files | 3 |
| Source files | 1 |
| Test files | 0 |
| Text lines | 90 |

### ▶️ Main paths

- `Week3JavaScriptandDOM/Day4AdvancedJavaScriptFunctions/Exercises/ExercisesXPGold/index.js`

### 🚀 Run

```bash
node Week3JavaScriptandDOM/Day4AdvancedJavaScriptFunctions/Exercises/ExercisesXPGold/index.js
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

**Last Updated:** October 7th, 2025

## What’s inside
- Exercise 1: Nested functions → arrow functions (`landscape()`)
- Exercise 2: Closure (`addTo`)
- Exercise 3: Currying (`curriedSum(30)(1)`)
- Exercise 4: Currying with partial (`add5(12)`)
- Exercise 5: Composition (`compose(inc, plus5)(10)`)

## Run
```bash
node index.js
```

## Expected console output
```
Exercise 1: ____/''''\____
Exercise 2: 13
Exercise 3: 31
Exercise 4: 17
Exercise 5: 16
```
