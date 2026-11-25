# 🥉 Exercises XP

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xp-773fa7fe22.svg" width="100%" alt="Progress card for Exercises XP">

</div>

Four classes in `exercisesxp.py`, one per exercise: `Cat`, `Dog`, `Song` and `Zoo`. Running the file plays all four demos in order.

## ▶️ How to run

```bash
python exercisesxp.py
```

```text
=== Exercise 1: Cats ===
The oldest cat is Nala, and is 7 years old.

=== Exercise 2: Dogs ===
Rex is 50.0 cm
Rex goes woof!
Rex jumps 100.0 cm high!
...
```

You'll also see `INFO - ...` lines mixed in. I added `logging` to every class, so each bark, jump and new animal gets logged.

## 🎯 The challenge

1. **Cats** - three cats (Mimi 4, Nala 7, Loki 2) go into `find_oldest_cat()`, which picks the winner with `max(cats, key=lambda cat: cat.age)`
2. **Dogs** - Rex (50 cm) and Teacup (20 cm) bark and jump. The jump is double the height, and the bark depends on size: Teacup says `yip yip!`, Rex says `woof!`
3. **Song** - `Song` keeps the lyrics as a list and `sing_me_a_song()` prints them one line at a time
4. **Zoo** - Brooklyn Safari gets a giraffe, a bear and a baboon, sells the bear, then `sort_animals()` groups what's left by first letter (`B: ['Baboon']`, `G: ['Giraffe']`)

`Cat`, `Dog` and `Song` are dataclasses. Their `__post_init__` rejects bad input, so `Cat("", 3)` or a negative age raises an error right away.

## 🧠 What I learned

- `self` is just the object the method was called on, and `__init__` fills it in
- `max()` with a `key` function finds the oldest cat without writing my own loop
- With `@dataclass` I don't write `__init__` at all, and `__post_init__` runs right after it for checks
- A `@property` like `size_category` reads like a normal attribute but is computed every time

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 2 Day 1 - Introduction to Object-Oriented Programming - Exercises XP
