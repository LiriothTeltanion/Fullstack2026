# Exercises XP — JavaScript (Functions, DOM, Loops)

<!-- NOVA:ULTIMATE:START -->
<div align="center">

<img src="../../../../assets/readme/nova-folder-pulse.svg" width="100%" alt="Animated NOVA learning pulse">

### Exercises XP

<img src="../../../../assets/readme/progress/exercises-xp-0ff82fe9a6.svg" width="100%" alt="Readiness status for Exercises XP">

**Goal:** Create interactive browser experiences with JavaScript, DOM events, accessibility, and responsive behavior.

</div>

## 🧭 NOVA Folder Guide

| Metric | Value |
|---|---:|
| Readiness | **80%** |
| Files | 4 |
| Source files | 2 |
| Test files | 0 |
| Text lines | 440 |

### ▶️ Main paths

- `Week3JavaScriptandDOM/Day2FunctionsandDOMIntroduction/Exercises/ExercisesXP/index.html`
- `Week3JavaScriptandDOM/Day2FunctionsandDOMIntroduction/Exercises/ExercisesXP/script.js`

### 🚀 Run

```bash
python -m http.server 8000
node Week3JavaScriptandDOM/Day2FunctionsandDOMIntroduction/Exercises/ExercisesXP/script.js
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

Short & simple solutions (commented in English) for 7 exercises. One HTML runner with buttons prints results to `<pre>` blocks and the console.

## Files
- `index.html` — UI to run each exercise and display outputs; includes required DOM scaffolds for Exercises 5–7.
- `script.js` — implementations for Exercises 1–7, plus helpers (`printOut`, `clearAll`, `runAll`).

## How to run
1. Open `index.html` in your browser.
2. Click **Run 1..7** or **Run ALL**. Check DevTools → Console too.
3. Some tasks (E4) ask for input via `prompt()`.

## Overview
- **E1 Divisible by 23** — `displayNumbersDivisible(divisor=23)` loops 0..500, prints numbers & sum.
- **E2 Shopping List** — builds total with `stock` & `prices`; decreases stock by 1 when purchased.
- **E3 What's in my wallet?** — `changeEnough(price, [q,d,n,p])` computes total and returns boolean.
- **E4 Vacations Costs** — prompts for hotel nights, destination, car days; prints itemized + total.
- **E5 Users (DOM)** — manipulates lists (rename, remove, classes, styles, hide “Dan”, border “Richard”), and bonus “Hello x and y” when bg is light blue.
- **E6 Change the navbar (DOM)** — renames id, appends “Logout”, prints first/last link text.
- **E7 My Book List (DOM)** — renders 2 books with 100px images; details in red if already read.

## Notes
- Code favors clarity over micro-optimizations.
- For E4, the “bonus” pattern is used: input prompts are only in `totalVacationCost()`.
- For E5/E6, the exact given HTML is present in `index.html` under each exercise card.

## License
Educational use. © 2025 Developers Institute prompt.
