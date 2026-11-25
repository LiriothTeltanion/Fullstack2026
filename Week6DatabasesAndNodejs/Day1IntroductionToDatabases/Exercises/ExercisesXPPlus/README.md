# ➕ Exercises XP Plus

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xpplus-a44867596e.svg" width="100%" alt="Progress card for Exercises XPPlus">

</div>

`exercisesxpplus.sql` builds a `students` table in the `bootcamp` database, adds the six students from the exercise plus one row for me, and then runs every query the exercise asks for.

## ▶️ How to run

```bash
psql -c "CREATE DATABASE bootcamp"
psql -d bootcamp -f exercisesxpplus.sql
```

The table is dropped and rebuilt each time. In pgAdmin I create `bootcamp`, open the Query Tool on it and run the file; every `SELECT` gets its own result tab.

## 🎯 The challenge

| Query | Condition | Returns |
|---|---|---|
| 1 | All columns | Every student |
| 2 | Only first and last names | Every student |
| a | `id = 2` | Yoan Cohen |
| b | `last_name = 'Benichou' AND first_name = 'Marc'` | Marc Benichou |
| c | `last_name = 'Benichou' OR first_name = 'Marc'` | Lea and Marc Benichou |
| d | First name contains `a` (`ILIKE '%a%'`) | Amelia, David, Lea, Marc, Yoan |
| e | First name starts with `a` (`ILIKE 'a%'`) | Amelia |
| f | First name ends with `a` (`ILIKE '%a'`) | Amelia, Lea |
| g | Second-to-last letter is `a` (`ILIKE '%a_'`) | Yoan |
| h | `id IN (1, 3)` | Marc and Lea Benichou |
| i | Born on or after 2000-01-01 (all columns) | David Grez and Yoan Cohen |

The exercise writes dates as `dd/mm/yyyy`. I typed them as `yyyy-mm-dd` instead, so PostgreSQL reads them correctly no matter what its `DateStyle` is.

## 🧠 What I learned

- With `GENERATED ALWAYS AS IDENTITY` the database numbers the rows and I never type an id
- In `ILIKE`, `%` is any amount of text and `_` is exactly one character, so `'%a_'` only matches names that end in "a" plus one letter
- `AND` gave me one row and `OR` gave me two, on the same two conditions
- `id IN (1, 3)` reads better than `id = 1 OR id = 3`

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 6 Day 1 - Introduction to Databases - Exercises XP Plus
