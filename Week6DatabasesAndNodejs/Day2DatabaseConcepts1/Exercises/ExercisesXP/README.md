# 🥉 Exercises XP

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xp-26b89bf1e6.svg" width="100%" alt="Progress card for Exercises XP">

</div>

One commented SQL file with two parts: four queries on the Day 1 `items` and `customers` tables, and fifteen on the `dvdrental` sample database.

## ▶️ How to run

Each part needs its own database, so in pgAdmin I open the Query Tool on the right one and run that section. With psql:

```bash
psql -d xp_exercises -f xp_sql_answers.sql   # part A
psql -d dvdrental -f xp_sql_answers.sql      # part B
```

psql keeps going after an error, so in each run the queries of the other part fail with `relation ... does not exist`.

## 🎯 The challenge

**Part A: `items` and `customers`**

1. All items, cheapest first.
2. Items with `price >= 80`, most expensive first.
3. The first three customers by first name, without the id column. The query also asks for an `email` column, which the Day 1 `customers` table does not have, so there it needs `email` taken out.
4. Every last name, Z to A.

**Part B: `dvdrental`**

| Query | What it returns |
|---|---|
| B.1 to B.4 | Customers: all columns, `first_name \|\| ' ' \|\| last_name AS full_name`, the distinct `create_date` values, and all rows by first name Z to A |
| B.5 | Films ordered by `rental_rate`, then title |
| B.6 | Address and phone of customers in the Texas district (`customer` joined with `address`) |
| B.7 | The films with id 15 and 150 |
| B.8, B.9 | A favourite film by its exact title (edit the placeholder first) or by its first two letters, `ILIKE 'AB%'` |
| B.10, B.11 | The 10 cheapest films, then films 11 to 20 using `ROW_NUMBER()` instead of `OFFSET` |
| B.12 | Every payment next to the customer's name, by customer and date |
| B.13 | Films with no copy in `inventory` (`NOT EXISTS`) |
| B.14 | Each city with its country |
| B.15 | Payments with the customer's name, ordered by the staff member who took them |

## 🧠 What I learned

- `||` joins strings and `AS` gives the new column a name
- `DISTINCT` removes repeated values from a result
- `ROW_NUMBER() OVER (ORDER BY ...)` can page results without `OFFSET`
- `NOT EXISTS` finds rows that have no match in another table
- A join needs the same key on both sides, like `address_id`

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 6 Day 2 - Database Concepts I - Exercises XP
