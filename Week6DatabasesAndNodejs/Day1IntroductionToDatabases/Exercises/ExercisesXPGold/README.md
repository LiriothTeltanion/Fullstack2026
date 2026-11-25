# 🥇 Exercises XP Gold

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xpgold-4e2fb61e02.svg" width="100%" alt="Progress card for Exercises XPGold">

</div>

Three extra questions for the `students` table from XP Plus. All of them return `first_name`, `last_name` and `birth_date`.

## ▶️ How to run

[XP Plus](../ExercisesXPPlus/) has to run first, so `public.students` exists in `bootcamp`. Then:

```bash
psql -d bootcamp -f exercisesxpgold.sql
```

The pgAdmin version of these steps is in [`exercisesxpgold.md`](exercisesxpgold.md).

## 🎯 The challenge

1. **First four by last name**: `ORDER BY last_name, first_name LIMIT 4`. The two Benichous come first (Lea before Marc), then Cohen and Cusnir.
2. **Youngest student**: `ORDER BY birth_date DESC LIMIT 1` gives Yoan Cohen, born 2010-12-03.
3. **Skip two, take three**: `ORDER BY id OFFSET 2 LIMIT 3` gives Lea Benichou, Amelia Dux and David Grez.

## 🧠 What I learned

- Two people share the last name Benichou, so `first_name` as a second sort key decides who goes first
- Youngest means the latest date, which is why the sort is `DESC`
- `OFFSET 2 LIMIT 3` is basically "page 2" when a page is small
- Without `ORDER BY id`, the database could hand back the rows in any order and the paging would be meaningless

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 6 Day 1 - Introduction to Databases - Exercises XP Gold
