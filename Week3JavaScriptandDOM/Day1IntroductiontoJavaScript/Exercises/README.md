# Exercises

<!-- NOVA:ULTIMATE:START -->
<div align="center">

<img src="../../../assets/readme/nova-folder-pulse.svg" width="100%" alt="Animated NOVA learning pulse">

### Exercises

<img src="../../../assets/readme/progress/exercises-136a7c3350.svg" width="100%" alt="Readiness status for Exercises">

**Goal:** Create interactive browser experiences with JavaScript, DOM events, accessibility, and responsive behavior.

</div>

## 🧭 NOVA Folder Guide

| Metric | Value |
|---|---:|
| Readiness | **80%** |
| Files | 14 |
| Source files | 5 |
| Test files | 0 |
| Text lines | 675 |

### ▶️ Main paths

- `Week3JavaScriptandDOM/Day1IntroductiontoJavaScript/Exercises/ExercisesXP/index.html`
- `Week3JavaScriptandDOM/Day1IntroductiontoJavaScript/Exercises/ExercisesXP/script.js`
- `Week3JavaScriptandDOM/Day1IntroductiontoJavaScript/Exercises/ExercisesXPGold/index.html`
- `Week3JavaScriptandDOM/Day1IntroductiontoJavaScript/Exercises/ExercisesXPGold/script.js`

### 🚀 Run

```bash
python -m http.server 8000
node Week3JavaScriptandDOM/Day1IntroductiontoJavaScript/Exercises/ExercisesXP/script.js
python -m http.server 8000
```

### 🟢 What is already strong

- ✅ README documentation is generated and repeatable.
- ✅ Contains 5 source file(s) across practical exercises or projects.
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

<sub>Managed by NOVA Ultimate v2.0.0 · 2026-07-15T06:22:48+03:00</sub>
<!-- NOVA:ULTIMATE:END -->
