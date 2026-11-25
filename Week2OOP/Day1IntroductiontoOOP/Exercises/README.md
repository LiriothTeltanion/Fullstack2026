# 🏋️ OOP Exercises - Introduction to Classes and Objects

<div align="center">

<img src="../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../assets/readme/progress/exercises-3cc599f444.svg" width="100%" alt="Progress card for Exercises">

</div>

The Day 1 exercises, where I wrote my first Python classes.

## 📁 Folders

- [ExercisesXP](ExercisesXP/) — the main set, all in `exercisesxp.py`
- [ExercisesXPGold](ExercisesXPGold/) — Circle, MyList and a small MenuManager
- [ExercisesXPNinja](ExercisesXPNinja/) — a Phone class with calls and messages

## 🚀 How to run

From this folder:

```bash
python ExercisesXP/exercisesxp.py
python ExercisesXPGold/exercisesxpgold.py
python ExercisesXPNinja/exercisesxpninja.py
```

## 📊 XP exercises

1. **Cats** — create three `Cat` objects and find the oldest one
2. **Dogs** — two `Dog` objects that bark and jump, then compare their heights
3. **Song** — a `Song` that stores lyrics and prints them line by line
4. **Zoo** — a `Zoo` that adds, sells, sorts and groups animals by first letter

```python
cat1 = Cat("Mimi", 4)
cat2 = Cat("Nala", 7)
cat3 = Cat("Loki", 2)
oldest = find_oldest_cat(cat1, cat2, cat3)
print(f"The oldest cat is {oldest.name}, and is {oldest.age} years old.")
```

## 💡 What I practiced

- Defining classes with `__init__` and instance attributes
- Writing methods that read or change an object's state
- Passing objects into functions and comparing their attributes
- Using descriptive names: nouns for classes, verbs for methods

## 👤 Author

**Kevin "Lirioth" Cusnir**
https://github.com/LiriothTeltanion/Fullstack2026
