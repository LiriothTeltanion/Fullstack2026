# DI — Databases XP+ : Students (PostgreSQL)

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
