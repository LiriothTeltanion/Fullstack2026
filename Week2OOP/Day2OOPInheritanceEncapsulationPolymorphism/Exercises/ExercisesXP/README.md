# 🥉 Exercises XP

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xp-f1817611e4.svg" width="100%" alt="Progress card for Exercises XP">

</div>

Four small programs in `exercisesxp.py` that practice inheritance, wrapper classes and polymorphism.

## ▶️ How to run

```bash
python exercisesxp.py
```

```text
EX1 - Cats walk:
Nala is just walking around
Milo is just walking around
Luna is just walking around
------------------------------
EX2 - Dogs:
Rex is barking
50.0
Rex wins!
LunaDog wins!
...
```

The trick in exercise 3 is picked with `random.choice`, so that line changes on each run.

## 🎯 The challenge

1. **Pets** - `Bengal`, `Chartreux` and `Siamese` inherit from `Cat`; a `Pets` object calls `walk()` on every cat without caring about the breed
2. **Dogs** - a `Dog` can bark, has `run_speed()` (weight / age × 10) and `fight()`, where the higher speed × weight wins
3. **PetDog** - a subclass of `Dog` that calls `super().__init__()`, adds `train()`, `play(*args)` and `do_a_trick()`; an untrained dog prints that it is not trained yet
4. **Family** - `Family.born()` creates `Person` objects with the family's last name, and `check_majority()` uses `is_18()` to decide if a member may go out

## 🧠 What I learned

- A subclass gets every method of its parent for free and only adds what is new
- `super().__init__()` is how a child class reuses the parent's setup
- Polymorphism means one loop can call the same method on different classes
- `*args` lets `play()` accept any number of dogs or plain names

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 2 Day 2 - Inheritance, Encapsulation and Polymorphism - Exercises XP
