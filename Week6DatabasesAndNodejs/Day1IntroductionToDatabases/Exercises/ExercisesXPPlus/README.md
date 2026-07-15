# DI — Databases XP+ : Students (PostgreSQL)

<!-- NOVA:ULTIMATE:START -->
<div align="center">

<img src="../../../../assets/readme/nova-folder-pulse.svg" width="100%" alt="Animated NOVA learning pulse">

### Exercises XPPlus

<img src="../../../../assets/readme/progress/exercises-xpplus-a44867596e.svg" width="100%" alt="Readiness status for Exercises XPPlus">

**Goal:** Practice relational modeling, safe queries, joins, constraints, and persistent data workflows.

</div>

## 🧭 NOVA Folder Guide

| Metric | Value |
|---|---:|
| Readiness | **80%** |
| Files | 4 |
| Source files | 1 |
| Test files | 0 |
| Text lines | 134 |

### ▶️ Main paths

- `Week6DatabasesAndNodejs/Day1IntroductionToDatabases/Exercises/ExercisesXPPlus/exercisesxpplus.sql`

### 🚀 Run

```bash
psql -f Week6DatabasesAndNodejs/Day1IntroductionToDatabases/Exercises/ExercisesXPPlus/exercisesxpplus.sql
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

This package contains a single SQL script to create the `students` table, insert the required rows, and run all the queries requested in the XP+ exercise.

## Files
- `exercisesxpplus.sql` — full script (create, insert, select). Safe to re-run; it drops the table if it exists.
- `.gitignore` — ignores generated artifacts.

## Notes
- In PostgreSQL, `public` is a schema, not a database. The exercise asks to create a database named `bootcamp` and then work in schema `public`.
- Dates are provided in the exercise as `dd/mm/yyyy`. PostgreSQL expects `yyyy-mm-dd`. The script converts them to ISO format.

## How to run

### Option A — pgAdmin (GUI)
1. Create a database named `bootcamp` (Right-click **Databases** → **Create** → **Database…** → Name: `bootcamp` → Save).
2. Open **Query Tool** on the `bootcamp` database.
3. Open `exercisesxpplus.sql` from this package, paste into the query editor, and execute.
4. You will see result grids for each `SELECT` at the end of the script.

### Option B — psql (terminal)
```bash
# 1) Create the database (adjust user/host/port as needed)
psql -U postgres -h localhost -p 5432 -c "CREATE DATABASE bootcamp"

# 2) Run the script against that database
psql -U postgres -h localhost -p 5432 -d bootcamp -f exercisesxpplus.sql
```

## Push to GitHub
```bash
git init
git add .
git commit -m "feat: Solve DI Databases XP+ — students"
git branch -M main
git remote add origin <YOUR_GITHUB_REMOTE_URL>
git push -u origin main
```
