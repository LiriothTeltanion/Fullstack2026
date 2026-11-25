# Exercises XP Gold — Single-File Solutions 🧠🐍

Everything is in **one Python file**: `exercisesxpgold.py` + this `readme.md`.  
Comments and docstrings are in **English**. Emojis included where useful. ✨

## What’s inside
- ⭕ **Circle** — `perimeter()`, `area()`, `describe()`
- 🔤 **MyList** — `reversed_list()`, `sorted_list()`, bonus `random_numbers_like()`
- 🍽️ **MenuManager** — `add_item`, `update_item`, `remove_item`, `print_menu`

### Spice levels (MenuManager)
- A = not spicy  
- B = a little spicy  
- C = very spicy 🌶️

## How to run
```bash
python exercisesxpgold.py   # runs small demos for all classes
```

## Quick import examples
```python
from exercisesxpgold import Circle, MyList, MenuManager

c = Circle(2.5)
print(round(c.perimeter(), 2), round(c.area(), 2))

ml = MyList(["b","A","c"])
print(ml.reversed_list(), ml.sorted_list(), ml.random_numbers_like(1, 3))

mm = MenuManager()
mm.add_item("Falafel", 12, "A", False)
mm.update_item("Soup", 11, "B", False)
mm.remove_item("Hamburger")
```
Enjoy! 💙
