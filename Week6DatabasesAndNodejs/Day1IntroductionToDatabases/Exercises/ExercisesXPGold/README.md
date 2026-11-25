# 🥇 Exercises XP Gold

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xpgold-4e2fb61e02.svg" width="100%" alt="Progress card for Exercises XPGold">

</div>

Three more queries on the `students` table from XP Plus. Each one returns `first_name`, `last_name` and `birth_date`.

## ▶️ How to run

Run [XP Plus](../ExercisesXPPlus/) first so `public.students` exists in the `bootcamp` database, then:

```bash
psql -d bootcamp -f exercisesxpgold.sql
```

[`exercisesxpgold.md`](exercisesxpgold.md) has the same steps for pgAdmin.

## 🎯 The challenge

1. **First four students by last name**: `ORDER BY last_name, first_name LIMIT 4`, so the two Benichous come first, Lea before Marc.
2. **Youngest student**: `ORDER BY birth_date DESC LIMIT 1` returns Yoan Cohen (2010-12-03).
3. **Skip two, take three**: `ORDER BY id OFFSET 2 LIMIT 3` returns Lea Benichou, Amelia Dux and David Grez.

## 🧠 What I learned

- A second sort column breaks ties when two rows share a last name
- The newest birth date belongs to the youngest person, so the order is `DESC`
- `OFFSET` skips rows and `LIMIT` caps how many come back
- Paging needs a stable order (here `id`), or the rows can change between runs

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 6 Day 1 - Introduction to Databases - Exercises XP Gold
