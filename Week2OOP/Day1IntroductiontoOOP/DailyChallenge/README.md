# 💪 Daily Challenge - Old MacDonald's Farm

<div align="center">

<img src="../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../assets/readme/progress/daily-challenge-b452743c13.svg" width="100%" alt="Progress card for Daily Challenge">

</div>

A small `Farm` class that counts how many animals of each type live on the farm and prints them in a neat column, finishing with "E-I-E-I-0!".

## ▶️ How to run

```bash
python oldmcdonaldsfarm.py
```

The script builds McDonald's farm (5 cows, 2 sheep, 12 goats) and prints the full info and a one-line summary:

```text
McDonald's farm

cow   : 5
sheep : 2
goat  : 12

    E-I-E-I-0!

McDonald's farm has cows, goats and sheeps.
```

## 🎯 The challenge

| Method | What it does |
|---|---|
| `add_animal(animal_type, count=1)` | Adds to a dictionary, so adding `'sheep'` twice gives 2 sheep |
| `get_info()` | Lines the animal names up in a column, using the longest name as the width |
| `get_animal_types()` | Returns the types in alphabetical order |
| `get_short_info()` | Builds a sentence with plurals and "and" before the last type |

```python
macdonald = Farm("McDonald")
macdonald.add_animal('cow', 5)
macdonald.add_animal('sheep')
macdonald.add_animal('sheep')
macdonald.add_animal('goat', 12)
print(macdonald.get_info())
```

## 🧠 What I learned

- Storing counts in a dictionary with `dict.get(key, 0)` is simpler than keeping a list of animal objects
- f-string format specs like `{name:<{width}}` make aligned text output easy
- Joining a list into natural English ("a, b and c") needs a few edge cases: empty, one item, two items

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 2 Day 1 - Introduction to Object-Oriented Programming - Daily Challenge
