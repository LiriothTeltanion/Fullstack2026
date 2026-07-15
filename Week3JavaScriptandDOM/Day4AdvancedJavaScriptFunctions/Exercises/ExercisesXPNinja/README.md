# Exercises XP Ninja — Advanced Functions: Merge Words (Currying)

<!-- NOVA:ULTIMATE:START -->
<div align="center">

<img src="../../../../assets/readme/nova-folder-pulse.svg" width="100%" alt="Animated NOVA learning pulse">

### Exercises XPNinja

<img src="../../../../assets/readme/progress/exercises-xpninja-a856c80b40.svg" width="100%" alt="Readiness status for Exercises XPNinja">

**Goal:** Create interactive browser experiences with JavaScript, DOM events, accessibility, and responsive behavior.

</div>

## 🧭 NOVA Folder Guide

| Metric | Value |
|---|---:|
| Readiness | **80%** |
| Files | 3 |
| Source files | 1 |
| Test files | 0 |
| Text lines | 53 |

### ▶️ Main paths

- `Week3JavaScriptandDOM/Day4AdvancedJavaScriptFunctions/Exercises/ExercisesXPNinja/index.js`

### 🚀 Run

```bash
node Week3JavaScriptandDOM/Day4AdvancedJavaScriptFunctions/Exercises/ExercisesXPNinja/index.js
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

**Goal**  
Create a function such that `mergeWords('Hello')()` returns `"Hello"`, and chaining more calls collects words into a sentence, e.g.  
`mergeWords('There')('is')('no')('spoon.')()` → `"There is no spoon."`

## Implementation (curried)
- Repeatedly call the returned function with a word.
- Calling it with **no argument** returns the accumulated sentence.

## Files
- `index.js` — implementation + small console demo.

## Run
```bash
node index.js
```

## Example Output
```
Hello
There is no spoon.

one two three
```
