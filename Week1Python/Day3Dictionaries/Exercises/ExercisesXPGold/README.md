# 🥇 Exercises XP Gold

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xpgold-dd00d1c574.svg" width="100%" alt="Progress card for Exercises XPGold">

</div>

[exercisesxpgold.py](exercisesxpgold.py) holds two small programs. One looks up birthdays by name and lets me add a new person first. The other adds up what it would cost to buy a fruit shop's whole stock. The prompts are in `_cli()`, so the helper functions can be imported without running anything.

## ▶️ How to run

```bash
python exercisesxpgold.py
```

```
Welcome! You can look up the birthdays of the people in the list.
Names: Alice, Bob, Charlie, Dana, Eli
Add a name (or press Enter to skip): Kevin
Enter birthday (YYYY/MM/DD): 1994/06/16
Names: Alice, Bob, Charlie, Dana, Eli, Kevin
Who do you want to look up? Kevin
Kevin's birthday is 1994/06/16
banana costs 4
apple costs 2
orange costs 1.5
pear costs 3
Total cost to buy everything: 89.0
```

## 🎯 The challenge

| Function | What it does |
|---|---|
| `add_birthday(birthdays, name, date)` | Gives back a new dictionary with the extra person, the old one stays as it was. |
| `lookup_birthday(birthdays, name)` | `birthdays.get(name)`, so a missing name returns `None` and `_cli()` prints a "Sorry" line. |
| `stock_value(items)` | Sums `price * stock` over the nested fruit dictionary: 4 × 10 + 2 × 5 + 1.5 × 24 + 3 × 1 = 89.0. |

Exercises 1 to 3 are the birthday part and Exercise 4 is the shop. The dates are just text, nothing checks the format, and the lookup is case-sensitive, so `alice` won't find `Alice`.

## 🧠 What I learned

- `", ".join(birthdays.keys())` prints all names on one line with commas
- `.get()` returning `None` made the "not found" branch a plain `if match:`
- A nested dictionary like `{"price": 4, "stock": 10}` reads better than two separate lists
- `sum()` with a generator was enough for the stock total, no loop variable needed

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 1 Day 3 - Dictionaries - Exercises XP Gold
