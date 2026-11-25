# 🏋️ Exercises XP - Dictionaries Fundamentals

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xp-285afc1699.svg" width="100%" alt="Progress card for Exercises XP">

</div>

Four exercises where I practiced the dictionary basics: building one from two lists, looping with `.items()`, editing a nested dictionary, and making several mappings from the same list.

## ▶️ How to run

```bash
python exercisesxp.py
```

The script prints every exercise in order. In the middle it asks `Add extra family? (y/n)` for the ticket bonus; type `n` to skip it.

## 📋 The exercises

### 1. Lists to dictionary
`build_dict()` pairs two lists with `zip()`:

```python
build_dict(["Ten", "Twenty", "Thirty"], [10, 20, 30])
# {'Ten': 10, 'Twenty': 20, 'Thirty': 30}
```

### 2. Cinemax family tickets
`ticket_price()` returns 0 under age 3, 10 from 3 to 12, and 15 above 12. `cinemax_report()` loops over the family with `.items()` and adds up the total:

```
rick pays 15
beth pays 15
morty pays 10
summer pays 10
total: 50
```

The bonus lets me add more family members from the keyboard. Negative or non-numeric ages are skipped with a message.

### 3. Zara brand
`update_brand()` works on a shallow copy of the nested `brand` dictionary: it sets `number_stores`, adds `country_creation`, appends "Desigual" to the competitors, removes `creation_date` with `.pop()`, and merges `more_on_zara` with `.update()`. `brand_summary()` then prints the clients, the last competitor, the US colors and the keys.

### 4. Disney characters
`disney_mappings()` builds three dictionaries from one list using `enumerate()`:

- name → index
- index → name
- name → index after `sorted()`

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
