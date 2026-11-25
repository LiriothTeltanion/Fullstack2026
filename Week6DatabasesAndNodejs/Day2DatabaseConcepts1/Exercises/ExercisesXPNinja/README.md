# 🥷 Exercises XP Ninja

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xp-ninja-0eb2fcc494.svg" width="100%" alt="Progress card for Exercises XP Ninja">

</div>

Seven harder questions on the `dvdrental` sample database, in [xp_ninja_dvdrental.sql](xp_ninja_dvdrental.sql).

## ▶️ How to run

This file only works on `dvdrental` (the PostgreSQL sample database from the course):

```bash
psql -d dvdrental -f xp_ninja_dvdrental.sql
```

## 🎯 The challenge

| Query | Question |
|---|---|
| 1 | The 5 longest films, with `length` also shown as text like `3h 5m`, built with `\|\|` |
| 2 | How many films each rating has (`GROUP BY rating`) |
| 3 | Customers whose first and last name start with the same letter (`LEFT(name, 1)`) |
| 4 | Films that cost more to replace than the average, with the average in a subquery |
| 5 | The 5 customers who paid the most, with `SUM(amount)` and `COUNT(*)` per customer |
| 6 | Actors in more than 35 films, filtered with `HAVING` |
| 7 | Films never rented, with two `LEFT JOIN`s and `rental_id IS NULL` |

## 🧠 What I learned

- `WHERE` filters rows before grouping and `HAVING` filters the groups after
- A subquery in `WHERE` lets me compare each film with a number computed from all films
- Grouping by `customer_id` is enough to also select the name, because the id is the primary key
- Query 7 also lists films that have no copy in `inventory` at all, since those can't have been rented either

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 6 Day 2 - Database Concepts I - Exercises XP Ninja
