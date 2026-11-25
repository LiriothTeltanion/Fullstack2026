# 🥷 Exercises XP Ninja

<div align="center">

<img src="../../../../assets/readme/days/week1-day1-python-foundations.svg" width="100%" alt="Week 1 Day 1 Python foundations map: Exercises XP 1–9, XP Gold 1–2 and XP Ninja 1–5 are covered by 23 tests, and the Daily Challenge by 5 more.">

</div>

Five harder Day 1 exercises in [exercisesxpninja.py](exercisesxpninja.py): how the terminal finds Python, boolean puzzles, counting characters and a "no letter A" sentence game.

## ▶️ How to run

```bash
python exercisesxpninja.py
```

In Exercise 5 I press Enter on an empty line to finish, and the program prints the longest valid sentence:

```
Enter sentences without the letter A. Press Enter to finish.
Sentence: hello world
Congratulations! New longest sentence: 11 characters.
Sentence:
Longest valid sentence: hello world
```

## 🎯 The challenge

1. **Terminal and PATH** - the operating system looks for programs in the folders listed in `PATH`, so `python` works from any directory.
2. **The `py` command** - on Windows, `py` is the Python Launcher, not a PowerShell alias.
3. **Boolean outputs** - I wrote my guesses as comments, then printed the real results:
   - `3 <= 3 < 9` → `True` (chained comparison) and `3 == 3 == 3` → `True`
   - `bool(0)` → `False` and `bool(5 == "5")` → `False`
   - `bool(4 == 4) == bool("4" == "4")` → `True` and `bool(bool(None))` → `False`
   - `True + 4` → `5` and `False + 10` → `10`, because booleans act like `1` and `0`
4. **Character count** - the supplied text has 445 characters; spaces count too.
5. **Longest sentence without A** - rejects sentences with `a` or `A` and only celebrates a strictly longer valid one.

## 🧪 Tests

From the repository root:

```bash
python -m unittest discover -s tests/python -p "test_week1_day1_exercises_xp_ninja.py" -v
```

7 tests in [test_week1_day1_exercises_xp_ninja.py](../../../../tests/python/test_week1_day1_exercises_xp_ninja.py) cover the five exercises.

## 🧠 What I learned

- Chained comparisons like `3 <= x < 9` are valid Python
- `None`, `0` and empty strings are falsy
- The check only looks for plain `a`/`A`; accented letters like `á` would need normalizing first

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 1 Day 1 - Starting with Python - Exercises XP Ninja
