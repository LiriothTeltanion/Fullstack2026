# 🥷 Exercises XP Ninja

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xp-ninja-42f647a6da.svg" width="100%" alt="Progress card for Exercises XP Ninja">

</div>

Six multi-table questions on `dvdrental` in [xp_ninja_dvdrental.sql](xp_ninja_dvdrental.sql), each one walking through three to five tables.

## 🧒 Assignment practice: DVD waiting list

[required_waiting_list_demo.sql](required_waiting_list_demo.sql) is a self-contained synthetic demonstration of the family-DVD and waiting-list requirements. The six questions below remain extra practice.

~~~bash
psql -v ON_ERROR_STOP=1 -d fullstack_practice -f required_waiting_list_demo.sql
~~~

Use a disposable practice database. The script creates its own schema inside BEGIN and finishes with ROLLBACK; it does not need the real dvdrental dataset. If that schema already exists, creation fails rather than reusing it.

The demonstration lists available physical copies rated G or PG, using NOT EXISTS for outstanding rentals. Every waiting entry references both a DVD copy and a child. A partial unique index prevents duplicate active requests. Counts include DVDs with zero children waiting.

Collection records picked_up_at: the child's name disappears from the active query and the DVD count decreases, while historical information remains. Collection is refused when the copy has an outstanding rental. The fixture verifies foreign keys, duplicate rejection, invalid pickup dates, availability, collection and rollback. After ROLLBACK, no demonstration schema remains.

## ▶️ How to run

Only on the `dvdrental` sample database:

```bash
psql -d dvdrental -f xp_ninja_dvdrental.sql
```

## 🎯 The challenge

| Query | Question | Tables |
|---|---|---|
| 1 | Top 5 categories by number of rentals | `category`, `film_category`, `inventory`, `rental` |
| 2 | Revenue per store | `payment`, `rental`, `inventory` |
| 3 | Customers who rented from at least 15 different categories (`COUNT(DISTINCT ...)`) | `customer`, `rental`, `inventory`, `film_category` |
| 4 | Pairs of actors in at least 6 films together | `film_actor` joined with itself, then `actor` twice |
| 5 | Each customer's latest rental with `ROW_NUMBER() OVER (PARTITION BY ...)` | `rental`, `customer`, `inventory`, `film` |
| 6 | Late returns: kept more days than `rental_duration` | `rental`, `inventory`, `film` |

## 🧠 What I learned

- In the self-join, `fa2.actor_id > fa1.actor_id` keeps each pair once and skips an actor paired with himself
- A window function numbers rows inside each customer, and `rn = 1` picks the newest
- Casting timestamps with `::date` and subtracting gives whole days, which is what `rental_duration` counts

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 6 Day 3 - Database Concepts II - Exercises XP Ninja
