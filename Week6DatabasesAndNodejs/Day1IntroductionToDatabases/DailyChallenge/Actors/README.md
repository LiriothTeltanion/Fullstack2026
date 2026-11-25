# 💪 Daily Challenge - Actors

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/actors-deac7f3275.svg" width="100%" alt="Progress card for Actors">

</div>

[actors.sql](actors.sql) creates an `actors` table, counts the rows, and then tries to break it with blank fields to see what PostgreSQL accepts.

## ▶️ How to run

The script makes its own table, so any empty database works:

```bash
createdb actors_challenge
psql -d actors_challenge -f actors.sql
```

Two of the inserts fail on purpose. psql prints the error and carries on with the next statement.

## 🎯 The challenge

1. Create `actors` with every column `NOT NULL` and add five actors.
2. `SELECT COUNT(*)` gives 5.
3. Insert Ryan Gosling with `NULL` birth date and Oscars. PostgreSQL refuses it: `null value in column "birth_date" ... violates not-null constraint`.
4. Insert an actor whose first name is `''`. That one is accepted, and the count becomes 6, because an empty string is a value.
5. Delete that row, add `CHECK (first_name <> '')`, and try the empty name again: now it fails on `first_name_not_empty`.
6. List everyone by number of Oscars.

## 🧠 What I learned

- `NOT NULL` only stops missing values; an empty string still passes
- A `CHECK` constraint can't be added while a row breaks it, which is why the delete comes first
- PostgreSQL names the column in the error, so I know which blank field was the problem
- I named the date column `birth_date`, since a column called `age` holding a date would confuse anyone reading it

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 6 Day 1 - Introduction to Databases - Daily Challenge
