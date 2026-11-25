# 🥉 Exercises XP

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xp-80340752f0.svg" width="100%" alt="Progress card for Exercises XP">

</div>

`xp_dvdrental_relationships.sql` answers two `dvdrental` exercises. The first is about film languages and two new tables tied together with foreign keys; the second is a set of questions about rentals that haven't come back.

## ▶️ How to run

```bash
psql -d dvdrental -f xp_dvdrental_relationships.sql
```

Careful: this script changes data. It creates `new_film` (which stays), creates `customer_review` (dropped again in exercise 2) and switches ACADEMY DINOSAUR to German. I'd run it on a copy of `dvdrental`.

## 🎯 The challenge

**Exercise 1: languages and new tables**

1. List the languages.
2. Join each film with its language name.
3. `LEFT JOIN` starting from `language`, so a language with no films still shows up (with empty film columns).
4. Create `new_film (id, name)` and add SUMO SPIRIT, RIVER BOAT RIDDLE and DOCU HOUR.
5. Create `customer_review`, where `film_id REFERENCES new_film(id) ON DELETE CASCADE`, plus a language foreign key and `score` limited to 1–10. Then add two reviews.
6. Delete RIVER BOAT RIDDLE and select the reviews again: its review has disappeared too.

**Exercise 2: more questions**

1. Change a film's language (ACADEMY DINOSAUR becomes German).
2. Read the foreign keys of `customer` from `pg_constraint`. They mean a new customer has to point at a store and an address that already exist.
3. Drop `customer_review`; nothing depends on it, so it goes without complaint.
4. Count rentals with `return_date IS NULL`.
5. The 30 outstanding films with the highest `replacement_cost`.
6. Four searches for a friend: a sumo film with Penelope Monroe, a short R-rated documentary, a film Matthew Mahan paid more than 4.00 for and returned between 28 July and 1 August 2005, and a boat film he rented that costs at least 25 to replace.

## 🧠 What I learned

- Starting the `LEFT JOIN` from `language` is what keeps the languages that have no films
- With `ON DELETE CASCADE` one `DELETE` on `new_film` also cleaned up `customer_review`
- Inside an `INSERT` I can look up ids with small subqueries like `(SELECT id FROM new_film WHERE name = 'SUMO SPIRIT')`
- For "returned by 1 August" I wrote `< DATE '2005-08-02'`, so times during 1 August are included
- `return_date = NULL` never matches anything; it has to be `IS NULL`

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 6 Day 3 - Database Concepts II - Exercises XP
