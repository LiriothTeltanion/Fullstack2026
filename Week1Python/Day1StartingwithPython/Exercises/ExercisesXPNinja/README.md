# 🥷 Exercises XP Ninja — Boolean Logic and Text Constraints

<div align="center">

<img src="../../../../assets/readme/days/week1-day1-python-foundations.svg" width="100%" alt="Week 1 Day 1 Python foundations map: Exercises XP 1–9, XP Gold 1–2 and XP Ninja 1–5 are covered by 23 tests, and the Daily Challenge by 5 more.">

</div>

Five harder Day 1 exercises in [exercisesxpninja.py](exercisesxpninja.py).

## 🧭 The exercises

| # | Exercise | Main idea |
|---|---|---|
| 1 | Terminal and PATH | The operating system looks for programs in the folders listed in `PATH`, so `python` works from any directory. |
| 2 | The `py` command | On Windows, `py` is the Python Launcher, not a PowerShell alias. |
| 3 | Boolean outputs | I wrote my guesses as comments, then printed the real results. |
| 4 | Character count | The supplied text has 445 characters; spaces count too. |
| 5 | Longest sentence without A | Rejects sentences with `a` or `A` and only celebrates a strictly longer valid one. |

Exercise 3 outputs:

- `3 <= 3 < 9` → `True` (chained comparison)
- `3 == 3 == 3` → `True`
- `bool(0)` → `False`
- `bool(5 == "5")` → `False`
- `bool(4 == 4) == bool("4" == "4")` → `True`
- `bool(bool(None))` → `False`
- `True + 4` → `5` and `False + 10` → `10`, because booleans act like `1` and `0`

In Exercise 5 I press Enter on an empty line to finish, and the program prints the longest valid sentence.

## ▶️ Run

```bash
python exercisesxpninja.py
```

## 🧪 Tests

7 tests in [tests/python/test_week1_day1_exercises_xp_ninja.py](../../../../tests/python/test_week1_day1_exercises_xp_ninja.py) cover these exercises. From the repository root:

```bash
python -m unittest discover -s tests/python -p "test_week1_day1_exercises_xp_ninja.py" -v
```

## 💡 What I learned

- Chained comparisons like `3 <= x < 9` are valid Python.
- `None`, `0` and empty strings are falsy.
- The check only looks for plain `a`/`A`; accented letters like `á` would need normalizing first.

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)
