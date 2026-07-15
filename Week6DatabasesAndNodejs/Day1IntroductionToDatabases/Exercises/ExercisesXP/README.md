# DI — Databases XP: Items & Customers (PostgreSQL)

<!-- NOVA:ULTIMATE:START -->
<div align="center">

<img src="../../../../assets/readme/nova-folder-pulse.svg" width="100%" alt="Animated NOVA learning pulse">

### Exercises XP

<img src="../../../../assets/readme/progress/exercises-xp-337d5c9753.svg" width="100%" alt="Readiness status for Exercises XP">

**Goal:** Practice relational modeling, safe queries, joins, constraints, and persistent data workflows.

</div>

## 🧭 NOVA Folder Guide

| Metric | Value |
|---|---:|
| Readiness | **80%** |
| Files | 5 |
| Source files | 1 |
| Test files | 0 |
| Text lines | 173 |

### ▶️ Main paths

- `Week6DatabasesAndNodejs/Day1IntroductionToDatabases/Exercises/ExercisesXP/items_customers.sql`

### 🚀 Run

```bash
psql -f Week6DatabasesAndNodejs/Day1IntroductionToDatabases/Exercises/ExercisesXP/items_customers.sql
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

commented SQL to create two tables (`items`, `customers`), insert sample data, and run the required queries.

## Files
- `items_customers.sql` — full SQL script (create DB, tables, inserts, and queries).
- `sample_outputs.txt` — expected results for the final SELECTs (for quick checking).
- `.gitignore` — ignores generated files.

## Quickstart (pgAdmin or psql)

### Option A — pgAdmin
1. Open **pgAdmin** and connect to your PostgreSQL server.
2. Right–click **Databases**  **Create**  **Database…** and create: `xp_exercises`.
3. Open the **Query Tool** on `xp_exercises`.
4. Paste the contents of `items_customers.sql` **from the line that starts with `-- STEP 2`** (the script also contains a `CREATE DATABASE` line in STEP 1 which you can skip in pgAdmin if you already created the DB).
5. Press **Execute** . You can re-run safely; the script drops existing tables before re-creating them.

### Option B — psql (terminal)
```bash
# 1) Create the database
psql -U postgres -h localhost -p 5432 -c "CREATE DATABASE xp_exercises"

# 2) Run the script against the new DB
psql -U postgres -h localhost -p 5432 -d xp_exercises -f items_customers.sql
```

> **Note on “public”**: In PostgreSQL, **`public` is a schema**, not a database.  
> This project uses a database named **`xp_exercises`** and the default schema **`public`** to keep things standard and compatible with pgAdmin.

## What the script does

- Creates two tables:  
  - `public.items (id, name, price)`  
  - `public.customers (id, first_name, last_name)`
- Inserts the required rows.
- Runs the required queries:
  - All items
  - Items with `price > 80`
  - Items with `price <= 300` (300 included)
  - Customers with last name `'Smith'` (none in our seed  empty result)
  - Customers with last name `'Jones'`
  - Customers with first name not `'Scott'`

## Push to GitHub

1. Create a new repo (e.g., `di-sql-xp-items-customers`).
2. Add files and push:
```bash
git init
git add .
git commit -m "feat: Solve DI Databases XP — items & customers "
git branch -M main
git remote add origin <YOUR_GITHUB_REMOTE_URL>
git push -u origin main
```
