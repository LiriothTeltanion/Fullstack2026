# 💪 Daily Challenge - Old MacDonald's Farm

<div align="center">

<img src="../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../assets/readme/progress/daily-challenge-b452743c13.svg" width="100%" alt="Progress card for Daily Challenge">

</div>

Old MacDonald had a farm, and here it's a `Farm` class. It counts each type of animal and prints them in a lined-up column that ends with "E-I-E-I-0!".

## ▶️ How to run

```bash
python oldmcdonaldsfarm.py
```

The demo farm has 5 cows, 2 sheep and 12 goats. It prints the full info first, then a one-line summary:

```text
McDonald's farm

cow   : 5
sheep : 2
goat  : 12

    E-I-E-I-0!

McDonald's farm has cows, goats and sheep.
```

## 🎯 The challenge

| Method | What it does |
|---|---|
| `add_animal(animal_type, count=1)` | Adds to the count in a dictionary, so two calls with `'sheep'` give 2 sheep |
| `get_info()` | Pads every name to the length of the longest one, so the colons line up |
| `get_animal_types()` | Returns the animal types sorted A to Z |
| `get_short_info()` | Builds the summary sentence, with an `s` for counts above 1 (except words like `sheep` in `SAME_PLURAL`) and "and" before the last type |

```python
macdonald = Farm("McDonald")
macdonald.add_animal('cow', 5)
macdonald.add_animal('sheep')
macdonald.add_animal('sheep')
macdonald.add_animal('goat', 12)
print(macdonald.get_info())
```

## 🧠 What I learned

- `self.animals.get(animal_type, 0) + count` adds to a count even when the key doesn't exist yet
- A nested format spec, `{a:<{w}}`, pads text to a width I calculate at runtime
- A readable "a, b and c" list needs three cases: one item, two items, and more than two
- Adding an `s` isn't always the plural: a small set like `SAME_PLURAL` keeps "sheep" as "sheep"

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 2 Day 1 - Introduction to Object-Oriented Programming - Daily Challenge
