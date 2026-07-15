# Exercises XP — SQL Answers (PostgreSQL, pgAdmin / psql)

<!-- NOVA:ULTIMATE:START -->
<div align="center">

<img src="../../../../assets/readme/nova-folder-pulse.svg" width="100%" alt="Animated NOVA learning pulse">

### Exercises XP

<img src="../../../../assets/readme/progress/exercises-xp-26b89bf1e6.svg" width="100%" alt="Readiness status for Exercises XP">

**Goal:** Practice relational modeling, safe queries, joins, constraints, and persistent data workflows.

</div>

## 🧭 NOVA Folder Guide

| Metric | Value |
|---|---:|
| Readiness | **80%** |
| Files | 3 |
| Source files | 1 |
| Test files | 0 |
| Text lines | 156 |

### ▶️ Main paths

- `Week6DatabasesAndNodejs/Day2DatabaseConcepts1/Exercises/ExercisesXP/xp_sql_answers.sql`

### 🚀 Run

```bash
psql -f Week6DatabasesAndNodejs/Day2DatabaseConcepts1/Exercises/ExercisesXP/xp_sql_answers.sql
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

This pack contains a single **.sql** file with commented solutions for:
- Items & Customers (generic public schema)
- **dvdrental** sample database

Emojis are used for section markers (no hearts). Everything is in English.

## How to run
1. Open pgAdmin, connect to your server.
2. For **dvdrental** tasks, restore the `dvdrental` database if you haven't already.
3. Open the Query Tool for the right database.
4. Load `xp_sql_answers.sql` (folder icon), or copy–paste queries.
5. Run selected sections or the whole file.

## File
- `xp_sql_answers.sql` — annotated queries ready to execute.
