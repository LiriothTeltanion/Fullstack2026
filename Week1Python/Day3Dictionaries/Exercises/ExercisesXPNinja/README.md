# 🥷 Exercises XP Ninja

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xpninja-3644039a9f.svg" width="100%" alt="Progress card for Exercises XPNinja">

</div>

The car manufacturers exercise in [xpninjacars.py](xpninjacars.py): turning a string into a list, then counting, sorting and removing duplicates with small reusable functions. Running the script calls `_cli()`, so importing the module elsewhere stays quiet.

## ▶️ How to run

```bash
python xpninjacars.py
```

```
Total manufacturers: 5
Descending (Z-A): ['Volkswagen', 'Toyota', 'Honda', 'Ford Motor', 'Chevrolet']
Manufacturers with letter 'o': 5
Manufacturers without letter 'i': 5
No-duplicate list: Honda, Volkswagen, Toyota, Ford Motor, Chevrolet
New total (no duplicates): 5
Ascending A-Z with reversed names: ['telorvehC', 'rotoM droF', 'adnoH', 'atoyoT', 'negawskloV']
```

## 🎯 The challenge

| Function | What it does |
|---|---|
| `parse_manufacturers(names)` | Splits the comma-separated string into a clean list. |
| `sort_descending(names)` | Returns the list in Z-A order, ignoring case. |
| `count_with_letter(names, letter)` | Counts the names that contain a letter (upper or lower case). |
| `count_without_letter(names, letter)` | Counts the names that do not contain a letter. |
| `deduplicate_preserve_order(names)` | Bonus: removes duplicates but keeps the first-seen order. |
| `ascending_reversed(names)` | Bonus: sorts A-Z and reverses each name's letters. |

## 🧠 What I learned

- `sorted(names, key=lambda value: value.lower(), reverse=True)` gives Z-A without changing the original list or caring about case
- A `set` of seen names plus a list keeps the order while dropping duplicates
- `name[::-1]` reverses a string

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 1 Day 3 - Dictionaries - Exercises XP Ninja
