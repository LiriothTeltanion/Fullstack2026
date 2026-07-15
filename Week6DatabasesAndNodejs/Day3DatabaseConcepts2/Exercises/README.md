# Exercises

<!-- NOVA:ULTIMATE:START -->
<div align="center">

<img src="../../../assets/readme/nova-folder-pulse.svg" width="100%" alt="Animated NOVA learning pulse">

### Exercises

<img src="../../../assets/readme/progress/exercises-15c36a68b9.svg" width="100%" alt="Readiness status for Exercises">

**Goal:** Practice relational modeling, safe queries, joins, constraints, and persistent data workflows.

</div>

## 🧭 NOVA Folder Guide

| Metric | Value |
|---|---:|
| Readiness | **80%** |
| Files | 7 |
| Source files | 2 |
| Test files | 0 |
| Text lines | 364 |

### ▶️ Main paths

- `Week6DatabasesAndNodejs/Day3DatabaseConcepts2/Exercises/ExercisesXP/xp_dvdrental_relationships.sql`
- `Week6DatabasesAndNodejs/Day3DatabaseConcepts2/Exercises/ExercisesXPGold/xp_gold_dvdrental.sql`

### 🚀 Run

```bash
psql -f Week6DatabasesAndNodejs/Day3DatabaseConcepts2/Exercises/ExercisesXP/xp_dvdrental_relationships.sql
psql -f Week6DatabasesAndNodejs/Day3DatabaseConcepts2/Exercises/ExercisesXPGold/xp_gold_dvdrental.sql
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
