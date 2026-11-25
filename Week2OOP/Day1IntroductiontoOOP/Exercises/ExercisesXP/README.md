# 🥉 Exercises XP

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xp-773fa7fe22.svg" width="100%" alt="Progress card for Exercises XP">

</div>

My first four Python classes, all in `exercisesxp.py`: cats, dogs, a song and a zoo.

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

The script also prints `INFO - ...` log lines, because every class logs what it does.

## 🎯 The challenge

1. **Cats** - three `Cat` objects and `find_oldest_cat()`, which uses `max()` with `key=lambda cat: cat.age`
2. **Dogs** - two `Dog` objects that bark and jump (the jump is twice the height), then the bigger one is printed
3. **Song** - a `Song` that stores lyrics as a list and prints them line by line with `sing_me_a_song()`
4. **Zoo** - a `Zoo` that adds and sells animals, sorts them and groups them by first letter

The `Cat`, `Dog` and `Song` classes are dataclasses that check their values in `__post_init__` (for example, an empty name or a negative age raises an error).

## 🧠 What I learned

- `__init__` sets up a new object, and `self` is that object inside every method
- A function can take objects as arguments and compare their attributes
- `@dataclass` writes `__init__` for me, and `__post_init__` is the place to validate
- `@property` turns a method like `is_senior` into something that reads like an attribute

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 2 Day 1 - Introduction to Object-Oriented Programming - Exercises XP
