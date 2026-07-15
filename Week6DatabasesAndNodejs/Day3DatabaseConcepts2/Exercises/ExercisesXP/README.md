# Exercises XP — dvdrental Relationships & Queries (PostgreSQL)

<!-- NOVA:ULTIMATE:START -->
<div align="center">

<img src="../../../../assets/readme/nova-folder-pulse.svg" width="100%" alt="Animated NOVA learning pulse">

### Exercises XP

<img src="../../../../assets/readme/progress/exercises-xp-80340752f0.svg" width="100%" alt="Readiness status for Exercises XP">

**Goal:** Practice relational modeling, safe queries, joins, constraints, and persistent data workflows.

</div>

## 🧭 NOVA Folder Guide

| Metric | Value |
|---|---:|
| Readiness | **80%** |
| Files | 3 |
| Source files | 1 |
| Test files | 0 |
| Text lines | 175 |

### ▶️ Main paths

- `Week6DatabasesAndNodejs/Day3DatabaseConcepts2/Exercises/ExercisesXP/xp_dvdrental_relationships.sql`

### 🚀 Run

```bash
psql -f Week6DatabasesAndNodejs/Day3DatabaseConcepts2/Exercises/ExercisesXP/xp_dvdrental_relationships.sql
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

This pack contains a single SQL file with commented solutions for both exercises.
Emojis are used for section markers (no hearts).

## How to run
### pgAdmin
1) Open the **dvdrental** database (restore if needed).
2) Query Tool → open `xp_dvdrental_relationships.sql` (folder icon) → execute.

### psql
```bash
psql -d dvdrental -f xp_dvdrental_relationships.sql
```

## Notes
- The file is idempotent where possible; DDL uses `IF EXISTS/IF NOT EXISTS`.
- Some statements (like changing film languages) are examples; adjust titles/ids to your data if you’ve modified it.
