# 🗂️ Day 3 — Dictionaries

<div align="center">

<img src="../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../assets/readme/progress/day3-dictionaries-47ad664c02.svg" width="100%" alt="Progress card for Day3 Dictionaries">

</div>

Day 3 of the Developers Institute bootcamp was all about Python dictionaries: key-value pairs, safe lookups, nested data and building mappings from lists. Each folder below has its own README with the details and the exact command to run.

## 📁 What's in this folder

| Folder | What I practiced |
|--------|------------------|
| [ExercisesXP](Exercises/ExercisesXP/) | `zip()`, Cinemax ticket prices, the nested Zara brand dict, Disney character mappings |
| [ExercisesXPPlus](Exercises/ExercisesXPPlus/) | Student grade summary and sales data analysis |
| [ExercisesXPGold](Exercises/ExercisesXPGold/) | Birthday lookup and a fruit shop calculator |
| [ExercisesXPNinja](Exercises/ExercisesXPNinja/) | Car manufacturer list: counting, sorting, removing duplicates |
| [TimedChallenge1](Exercises/TimedChallenge1/) | Reversing the words of a sentence |
| [TimedChallenge2](Exercises/TimedChallenge2/) | Checking for a perfect number |
| [DailyChallenge/Dictionaries](DailyChallenge/Dictionaries/) | Letter index map and affordable items |
| [DailyChallenge/CaesarCypher](DailyChallenge/CaesarCypher/) | Caesar cipher encrypt and decrypt |

## ▶️ How to run

Every exercise is a single Python script (Python 3.8+, no extra packages). Go into its folder and run it, for example:

```bash
cd Exercises/ExercisesXP
python exercisesxp.py
```

## 🧠 Key concepts

```python
user = {"name": "Alice", "age": 25}

user.get("city", "Unknown")      # safe lookup with a default
for key, value in user.items():  # key and value together
    print(key, value)
user.update({"theme": "dark"})   # merge another dict
user.pop("age", None)            # remove without a KeyError
```

- Dictionaries are the right choice when data has names or labels; lists when order matters.
- Nested data (dicts inside dicts, lists inside dicts) is accessed one level at a time: `brand["major_color"]["US"]`.
- Keys must be immutable (strings, numbers, tuples).
- Don't add or remove keys while looping over the same dictionary; loop over `list(d)` instead.

## 🔗 Next

[Day 4 — Functions](../Day4Functions/)

This day's code is under the repository's [MIT License](../../LICENSE).

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
📂 Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
📅 Week 1 Day 3 - Dictionaries
