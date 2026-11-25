# 🥈 Python Practice — Birthdays & Fruit Shop

Two tiny console exercises: a birthday lookup (with optional insert) and a fruit shop inventory cost calculator. Code is kept simple with small comments.

> ▶️ Run with **Python 3.10+**. No extra packages required.

---

## 🚀 How to run

```bash
python exercisesxpgold.py
```
Execute the exercises via `exercisesxpgold.py`. The interactive flow now lives behind `_cli()`, so importing the module exposes pure helpers without triggering prompts.

Birthdays still ask for input when you run the CLI; the fruit shop section only prints results.

---

## 🎂 Exercise 1–3 — Birthdays

**🎯 Goal:** store some birthdays, optionally add a new person, show the names list, and look up one birthday.

**📊 Data shape:**
```python
birthdays = {
    "Alice": "1995/06/12",
    "Bob": "1990/01/23",
    # ...
}
```

**Key helpers:**
- `add_birthday(birthdays, name, date)` returns a new dictionary with the extra entry.
- `lookup_birthday(birthdays, name)` returns the stored date or `None`.

**Typical flow:**
1. Print a welcome message.
2. Print all names with `", ".join(birthdays.keys())`.
3. Ask the user to add a new name (press Enter to skip); use `add_birthday` if provided.
4. Show names again so the addition is visible.
5. Ask **who** to look up; call `lookup_birthday` and display the result.

**Example run (one possible flow):**
```
Welcome! You can look up the birthdays of the people in the list.
Names: Alice, Bob, Charlie, Dana, Eli
Add a name (or press Enter to skip): Kevin
Enter birthday (YYYY/MM/DD): 1994/06/16
Names: Alice, Bob, Charlie, Dana, Eli, Kevin
Who do you want to look up? Kevin
Kevin's birthday is 1994/06/16
```

**Notes:**
- Date format is treated as plain text (no validation here).
- Keys are case‑sensitive (`"alice"` ≠ `"Alice"`).
- To avoid duplicates, you can check `if new_name in birthdays` before inserting.
- Time complexity: all operations shown are **O(n)** or better for these tiny tasks.

---

## Exercise 4 — Fruit Shop

**Goal:** print item prices and compute the **total cost** to buy all stock from a nested dictionary.

Use `stock_value(items)` to handle the multiplication and summation for you:

```python
from exercisesxpgold import stock_value

inventory = {
    "banana": {"price": 4, "stock": 10},
    "apple": {"price": 2, "stock": 5},
    "orange": {"price": 1.5, "stock": 24},
    "pear": {"price": 3, "stock": 1},
}

stock_value(inventory)
# -> 162.0
```

**Notes:**
- Multiplying `price * stock` gives the cost to clear that item.
- The helper assumes `price` and `stock` exist for each item; add guards if your data is messy.
- Wrap the result in your preferred formatting function if you need currency output.

---

## Tips for my future self
- For the birthdays dict, consider validating dates with `datetime.strptime`.
- Normalize names (e.g., `.title()`) to reduce case mismatches.
- For the fruit shop, guard against missing keys with `dict.get` or `try/except`.
- The helpers are already unit-test friendly; the CLI remains only for parity with the original instructions.

---

## License
MIT — free to use, copy, and modify.
---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 1 Day 3 - Exercises XP Gold

---

*Happy coding!* 🐍✨
