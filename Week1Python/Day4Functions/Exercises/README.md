# Exercises

<!-- NOVA:ULTIMATE:START -->
<div align="center">

<img src="../../../assets/readme/nova-folder-pulse.svg" width="100%" alt="Animated NOVA learning pulse">

### Exercises

<img src="../../../assets/readme/progress/exercises-a0afe33b68.svg" width="100%" alt="Readiness status for Exercises">

**Goal:** Organize practical exercises with clear goals, execution paths, validation, and improvement guidance.

</div>

## 🧭 NOVA Folder Guide

| Metric | Value |
|---|---:|
| Readiness | **80%** |
| Files | 13 |
| Source files | 4 |
| Test files | 0 |
| Text lines | 1,958 |

### ▶️ Main paths

- `Week1Python/Day4Functions/Exercises/ExercisesXP/exercisesxp.py`
- `Week1Python/Day4Functions/Exercises/ExercisesXPGold/xpgoldfunctions.py`
- `Week1Python/Day4Functions/Exercises/ExercisesXPNinja/xpninjafunctionssingle.py`

### 🚀 Run

```bash
python Week1Python/Day4Functions/Exercises/ExercisesXP/exercisesxp.py
python Week1Python/Day4Functions/Exercises/ExercisesXPGold/xpgoldfunctions.py
python Week1Python/Day4Functions/Exercises/ExercisesXPNinja/xpninjafunctionssingle.py
```

### 🟢 What is already strong

- ✅ README documentation is generated and repeatable.
- ✅ Contains 4 source file(s) across practical exercises or projects.
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
