# 💪 Daily Challenge - Dictionaries

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/dictionaries-9a26300e0f.svg" width="100%" alt="Progress card for Dictionaries">

</div>

Two small dictionary challenges: mapping each letter of a word to its positions, and finding which items I can afford with a given wallet.

## ▶️ How to run

```bash
python dictionaries.py
```

It asks for a word, prints the letter map, and then runs the three shopping examples from the exercise. I used Python 3.10+.

## 🔤 Challenge 1 — Letter index dictionary

`letter_indices()` loops with `enumerate()` and uses `setdefault()` to start a list the first time a letter shows up:

```python
for idx, ch in enumerate(word):
    positions.setdefault(ch, []).append(idx)
```

```
Enter a word: mississippi
{'m': [0], 'i': [1, 4, 7, 10], 's': [2, 3, 5, 6], 'p': [8, 9]}
```

## 🛒 Challenge 2 — Affordable items

Prices come as strings like `"$1,000"`, so `to_int()` removes the `$` and the commas before converting. `affordable_items()` keeps the items that fit in the wallet and returns them sorted. If the list is empty, the script prints `Nothing`.

| Wallet | Result |
|--------|--------|
| `$300` | `['Bread', 'Fertilizer', 'Water']` |
| `$100` | `['Apple', 'Bananas', 'Fan', 'Honey', 'Pan', 'Spoon']` |
| `$1` | `Nothing` |

## 🧠 What I learned

- `enumerate()` gives the index and the character in one loop
- `setdefault(key, [])` saves the "is the key already there?" check
- Cleaning strings with chained `.replace()` before `int()`
- `sorted()` on a generator returns a new sorted list

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 1 Day 3 - Daily Challenge - Dictionaries
