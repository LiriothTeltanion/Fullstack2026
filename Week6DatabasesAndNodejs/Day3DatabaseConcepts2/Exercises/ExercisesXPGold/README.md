# 🥇 Exercises XP Gold

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xpgold-02be91889d.svg" width="100%" alt="Progress card for Exercises XPGold">

</div>

`xp_gold_dvdrental.sql` covers two more `dvdrental` exercises: rentals that are still out, and a "Happy Halloween" plan that adds up how much film each store could show.

## 🧪 Follow-up: visible safe list and zero totals

[required_gold_followup.sql](required_gold_followup.sql) adds the missing visible safe-film list and robust totals. Run it after the original questions, against a disposable dvdrental practice copy:

~~~bash
psql -v ON_ERROR_STOP=1 -d dvdrental -f required_gold_followup.sql
~~~

It does not create or change tables/views. Horror membership and the six case-insensitive scary substrings exclude a film; a missing description is treated as empty text. Catalog totals count each film once. Store totals count physical copies that have no outstanding rental; multiple returned rentals do not duplicate an available copy. LEFT JOIN plus COALESCE keeps stores with no inventory or no available copies at zero.

The original rental, grouped-customer, Joe Swank, city and country queries remain intact. Synthetic PostgreSQL verification covers them and this follow-up, including an empty catalog and a catalog with no safe films.

## ▶️ How to run

```bash
psql -d dvdrental -f xp_gold_dvdrental.sql
```

On the way it creates the view `vw_film_actor_category`, dropping any older version first.

## 🎯 The challenge

**Exercise 1: DVD rentals**

1. Every rental still out, with the customer and the film title, newest first.
2. The customers who still have rentals out, and how many each one has (`GROUP BY` + `COUNT(*)`).
3. Action films with Joe Swank, read from a view that joins `film`, `film_actor`, `actor`, `film_category` and `category`.

**Exercise 2: Happy Halloween**

- **A.** Each store with its address, city and country, and a separate count of stores.
- **B.** Viewing time per store in minutes, hours and days. A `WITH available_items` step keeps only copies that are not out on rent.
- **C and D.** Customers who live in the same cities, and then the same countries, as the stores.
- **E.** A "safe list": films outside the Horror category with none of beast, monster, ghost, dead, zombie or undead in the title or description (`~*` regex), and their total viewing time.
- **F.** The total for all films, to compare with E.
- One extra query mixes B and E: safe viewing time per store, available copies only.

## 🧠 What I learned

- After making the view, the Joe Swank query is just a `WHERE` on three columns instead of five joins
- `WITH` blocks let me name steps like `available_items` and `scary_films` and reuse the idea later
- `~*` is a case-insensitive regex; "undead" in my list is extra, because "dead" already matches it
- `SUM(length)/60.0` keeps the decimals, while dividing by `60` would cut them off

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 6 Day 3 - Database Concepts II - Exercises XP Gold
