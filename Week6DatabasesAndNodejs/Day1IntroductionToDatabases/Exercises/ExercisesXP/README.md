# 🥉 Exercises XP

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xp-337d5c9753.svg" width="100%" alt="Progress card for Exercises XP">

</div>

`items_customers.sql` creates two tables, `items` and `customers`, puts the exercise data in them and asks six questions with `SELECT`.

## ▶️ How to run

```bash
psql -c "CREATE DATABASE xp_exercises"
psql -d xp_exercises -f items_customers.sql
```

Both tables are dropped at the top, so I can run the file as many times as I want. In pgAdmin I make the `xp_exercises` database myself, open the Query Tool on it and run the file; the `CREATE DATABASE` line inside is commented out for that reason.

## 🎯 The challenge

| Query | What it returns |
|---|---|
| All items | 3 rows: Small Desk (100), Large Desk (300), Fan (80) |
| `price > 80` | Small Desk and Large Desk; the Fan at exactly 80 is left out |
| `price <= 300` | All 3 items, cheapest first, because 300 counts |
| `last_name = 'Smith'` | Nothing: there is no Smith in the data |
| `last_name = 'Jones'` | Greg Jones and Sandra Jones |
| `first_name <> 'Scott'` | 4 customers, everyone but Scott Scott |

Each table has a `SERIAL` primary key, and `items.price` has `CHECK (price >= 0)` so a negative price is refused. The expected rows are in [`sample_outputs.txt`](sample_outputs.txt). One small mismatch there: query 6 is printed in a different order than the script's `ORDER BY last_name, first_name` returns.

## 🧠 What I learned

- `public` is a schema inside the database, not a separate database
- Starting with `DROP TABLE IF EXISTS` means a second run doesn't fail on "table already exists"
- The difference between `>` and `<=` is exactly whether the border value (80 or 300) makes it in
- Asking for Smith gives an empty result, not an error

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 6 Day 1 - Introduction to Databases - Exercises XP
