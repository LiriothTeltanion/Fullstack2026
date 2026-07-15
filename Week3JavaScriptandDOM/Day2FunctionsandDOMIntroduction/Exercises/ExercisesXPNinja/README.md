# Exercises XP Ninja

<!-- NOVA:ULTIMATE:START -->
<div align="center">

<img src="../../../../assets/readme/nova-folder-pulse.svg" width="100%" alt="Animated NOVA learning pulse">

### Exercises XPNinja

<img src="../../../../assets/readme/progress/exercises-xpninja-18b57686e3.svg" width="100%" alt="Readiness status for Exercises XPNinja">

**Goal:** Create interactive browser experiences with JavaScript, DOM events, accessibility, and responsive behavior.

</div>

## 🧭 NOVA Folder Guide

| Metric | Value |
|---|---:|
| Readiness | **80%** |
| Files | 4 |
| Source files | 2 |
| Test files | 0 |
| Text lines | 244 |

### ▶️ Main paths

- `Week3JavaScriptandDOM/Day2FunctionsandDOMIntroduction/Exercises/ExercisesXPNinja/index.html`

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

What we will learn:
- Variables, Conditionals, Loops
- Functions
- DOM Manipulation

## Files
- `index.html` — loads the script and hosts the calendar root.
- `index.js` — solutions for Exercises 1–6.

## Run
Open `index.html` in a browser and open the console to see outputs for Exercises 1–5.  
A calendar example for `createCalendar(2012, 9)` is rendered on the page for Exercise 6.

### Functions
- `capitalize(str)` → returns `['AbCd…', 'aBcD…']` pattern.
- `isPalindrome(str)` → case-insensitive, ignores non-alphanumeric.
- `biggestNumberInArray(arr)` → max numeric value, returns 0 if none.
- `unique(arr)` → unique elements, order-preserving.
- `createCalendar(year, month)` → renders a Monday-first calendar table.
