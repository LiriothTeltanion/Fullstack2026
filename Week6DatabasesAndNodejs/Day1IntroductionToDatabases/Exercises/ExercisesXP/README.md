# DI — Databases XP: Items & Customers (PostgreSQL)

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
