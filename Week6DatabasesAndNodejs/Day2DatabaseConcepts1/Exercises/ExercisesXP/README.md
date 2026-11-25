# 🥉 Exercises XP

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xp-26b89bf1e6.svg" width="100%" alt="Progress card for Exercises XP">

</div>

`xp_sql_answers.sql` is split in two: part A has four queries on the Day 1 `items` and `customers` tables, part B has fifteen on the `dvdrental` sample database. Every query has a comment with the question it answers.

## ▶️ How to run

The two parts live in different databases. In pgAdmin I open the Query Tool on the right database and run only that section. With psql:

```bash
psql -d xp_exercises -f xp_sql_answers.sql   # part A
psql -d dvdrental -f xp_sql_answers.sql      # part B
```

psql doesn't stop at an error, so in each run the other part's queries just fail with `relation ... does not exist` and the rest still prints.

## 🎯 The challenge

**Part A: `items` and `customers`**

1. All items, cheapest first.
2. Items with `price >= 80`, most expensive first.
3. The first three customers by first name, without the id. My query also selects `email`, but the Day 1 `customers` table has no such column, so on that table `email` has to come out of the `SELECT` before it runs.
4. Only the last names, Z to A.

**Part B: `dvdrental`**

| Query | What it returns |
|---|---|
| B.1 to B.4 | Customers: every column, `first_name \|\| ' ' \|\| last_name AS full_name`, the distinct `create_date` values, and all rows by first name Z to A |
| B.5 | Films by `rental_rate`, then by title |
| B.6 | Address and phone of customers in the Texas district (`customer` joined with `address`) |
| B.7 | The films with id 15 and 150 |
| B.8, B.9 | A favourite film by exact title (the placeholder has to be replaced) or by its first two letters with `ILIKE 'AB%'` |
| B.10, B.11 | The 10 cheapest films, then films 11 to 20 picked with `ROW_NUMBER()` instead of `OFFSET` |
| B.12 | Every payment next to the customer's name, by customer and then date |
| B.13 | Films with no copy in `inventory` (`NOT EXISTS`) |
| B.14 | Each city with its country |
| B.15 | Payments with the customer's name, ordered by the staff member who took them |

## 🧠 What I learned

- `||` glues text together, and `AS full_name` names the column that comes out
- With `SELECT DISTINCT create_date` each date comes back once, however many customers share it
- For rows 11 to 20 I numbered the films with `ROW_NUMBER() OVER (...)` in a subquery and kept `rn BETWEEN 11 AND 20`
- `NOT EXISTS (SELECT 1 …)` finds films that never appear in `inventory`
- Adding `title` as a second sort key keeps the cheap films in the same order every run, since many share a price

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 6 Day 2 - Database Concepts I - Exercises XP
