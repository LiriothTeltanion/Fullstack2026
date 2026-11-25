# 🥇 Exercises XP Gold

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xpgold-8f60c9c51e.svg" width="100%" alt="Progress card for Exercises XPGold">

</div>

Three small classes in one file, `exercisesxpgold.py`: a circle, a list wrapper and a restaurant menu manager.

## ▶️ How to run

```bash
python exercisesxpgold.py
```

```text
>>> Circle demo ⭕
Perimeter: 18.85
Area: 28.27
...
Dish 'Falafel' added ✅
Dish 'Soup' updated ✅
Dish 'Hamburger' removed ✅
```

## 🎯 The challenge

1. **Circle** - `perimeter()`, `area()` and `describe()`; a radius of 0 or less raises `ValueError`
2. **MyList** - `reversed_list()`, `sorted_list()` (case-insensitive) and the bonus `random_numbers_like(low, high)`, which returns one random number per letter
3. **MenuManager** - starts with five dishes and has `add_item`, `update_item`, `remove_item` and `print_menu`; the spice level must be `A` (not spicy), `B` (a little spicy) or `C` (very spicy)

```python
mm = MenuManager()
mm.add_item("Falafel", 12, "A", False)
mm.update_item("Soup", 11, "B", False)
mm.remove_item("Hamburger")   # prints the updated menu
```

## 🧠 What I learned

- A constructor is a good place to reject bad values before the object exists
- Returning a new list keeps the original data safe from changes
- Small private helpers like `_find_index()` remove repeated search loops
- Comparing names with `.strip().lower()` makes lookups forgiving

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 2 Day 1 - Introduction to Object-Oriented Programming - Exercises XP Gold
