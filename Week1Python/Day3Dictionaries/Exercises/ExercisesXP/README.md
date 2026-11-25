# 🥉 Exercises XP

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xp-285afc1699.svg" width="100%" alt="Progress card for Exercises XP">

</div>

Four exercises in [exercisesxp.py](exercisesxp.py) where I practiced the dictionary basics: building one from two lists, looping with `.items()`, editing a nested dictionary, and making several mappings from the same list.

## ▶️ How to run

```bash
python exercisesxp.py
```

The script prints every exercise in order. In the middle it asks `Add extra family? (y/n)` for the ticket bonus; type `n` to skip it.

```
{'Ten': 10, 'Twenty': 20, 'Thirty': 30}
rick pays 15
beth pays 15
morty pays 10
summer pays 10
total: 50
Add extra family? (y/n): n
Zara clients: men, women, children, home
last competitor: Desigual
US colors: ['pink', 'green']
...
{'Ariel': 0, 'Donald': 1, 'Mickey': 2, 'Minnie': 3, 'Pluto': 4}
```

## 🎯 The challenge

| Function | What it does |
|---|---|
| `build_dict(keys, values)` | Pairs two lists with `zip()`: `["Ten", "Twenty", "Thirty"]` and `[10, 20, 30]` give `{'Ten': 10, 'Twenty': 20, 'Thirty': 30}`. |
| `ticket_price(age)` | Returns 0 under age 3, 10 from 3 to 12, and 15 above 12. |
| `cinemax_report(family)` | Loops over the family with `.items()` and adds up the total. |
| `_bonus_prompt()` | The bonus: adds more family members from the keyboard; negative or non-numeric ages are skipped with a message. |
| `update_brand()` | Works on a shallow copy of the nested Zara `brand` dictionary: sets `number_stores`, adds `country_creation`, appends "Desigual" to the competitors, removes `creation_date` with `.pop()`, then merges `more_on_zara` with `.update()` (which brings `creation_date` back and sets `number_stores` to 10000). |
| `brand_summary()` | Collects the clients, the last competitor, the US colors and the keys for printing. |
| `disney_mappings()` | Builds three dictionaries from one list with `enumerate()`: name → index, index → name, and name → index after `sorted()`. |

## 🧠 What I learned

- `dict(zip(keys, values))` is the quickest way to pair two lists
- `.items()` gives key and value together in a loop
- `.pop(key, None)` removes a key without crashing if it is missing
- `dict(brand)` is only a shallow copy: the top-level keys are new, but nested lists are still shared

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 1 Day 3 - Dictionaries - Exercises XP
