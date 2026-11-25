# 🥉 Exercises XP

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xp-80340752f0.svg" width="100%" alt="Progress card for Exercises XP">

</div>

SQL answers for two `dvdrental` exercises: film languages, two new tables linked by foreign keys, and questions about rentals that are still out.

## ▶️ How to run

```bash
psql -d dvdrental -f xp_dvdrental_relationships.sql
```

The script changes the database: it creates `new_film` (kept) and `customer_review` (dropped again in exercise 2) and sets the language of ACADEMY DINOSAUR to German, so a copy of `dvdrental` is the best place to run it.

## 🎯 The challenge

**Exercise 1: languages and new tables**

1. List all languages.
2. Join every film to its language name.
3. `LEFT JOIN` from `language`, so languages without films still appear.
4. Create `new_film (id, name)` and add three films.
5. Create `customer_review` with `film_id REFERENCES new_film(id) ON DELETE CASCADE`, a language foreign key and a `score` between 1 and 10, then add two reviews.
6. Delete RIVER BOAT RIDDLE and check that its review is gone too.

**Exercise 2: more questions**

1. Change the language of a film (ACADEMY DINOSAUR to German).
2. List the foreign keys defined on `customer` from `pg_constraint`; a new customer must point at rows that already exist.
3. Drop `customer_review`, since no other table depends on it.
4. Count the rentals that are still out (`return_date IS NULL`).
5. The 30 outstanding films with the highest `replacement_cost`.
6. Four searches for a friend: a sumo film with Penelope Monroe, a short R-rated documentary, a film Matthew Mahan paid more than 4.00 for and returned between 28 July and 1 August 2005, and a boat film he rented with a replacement cost of at least 25.

## 🧠 What I learned

- `LEFT JOIN` keeps every row of the left table, even without a match
- `ON DELETE CASCADE` removes the child rows when the parent row is deleted
- A `CHECK` constraint rejects bad values, like a score of 11
- `pg_constraint` shows which foreign keys a table has
- `IS NULL` (not `= NULL`) finds rentals that were never returned

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 6 Day 3 - Database Concepts II - Exercises XP
