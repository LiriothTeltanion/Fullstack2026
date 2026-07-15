# Exercise XP Gold — HTML Form #3 (plain)

<!-- NOVA:ULTIMATE:START -->
<div align="center">

<img src="../../../../assets/readme/nova-folder-pulse.svg" width="100%" alt="Animated NOVA learning pulse">

### Exercises XPGold

<img src="../../../../assets/readme/progress/exercises-xpgold-f1d06e9641.svg" width="100%" alt="Readiness status for Exercises XPGold">

**Goal:** Build resilient asynchronous flows with HTTP requests, loading states, validation, and error handling.

</div>

## 🧭 NOVA Folder Guide

| Metric | Value |
|---|---:|
| Readiness | **80%** |
| Files | 4 |
| Source files | 2 |
| Test files | 0 |
| Text lines | 78 |

### ▶️ Main paths

- `Week4AdvAsynchronousJavaScript/Day3HTTPAndFormMethodGETAndPOST/Exercises/ExercisesXPGold/index.html`

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

A minimal two-page form matching the screenshot layout. The first page submits with GET;
the second page reads the query string and writes the values into a `<section>` using the DOM.

## Files
- `index.html` — form with `name`, `lastname`, and submit.
- `result.html` — displays the submitted values inside `<section id="output">`.

## How to run
1. Open `index.html` in a browser.
2. Enter values (defaults provided) and press **Submit**.
3. `result.html` shows the values using a small inline script with `URLSearchParams`.
