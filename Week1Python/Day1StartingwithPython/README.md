# 🐣 Day 1 — Starting with Python

<div align="center">

<img src="../../assets/readme/days/week1-day1-python-foundations.svg" width="100%" alt="Week 1 Day 1 Python foundations map: Exercises XP 1–9, XP Gold 1–2 and XP Ninja 1–5 are covered by 23 tests, and the Daily Challenge by 5 more.">

</div>

Day 1 of the bootcamp covered the very basics: variables and data types, arithmetic, comparisons, `input()` and `print()`, `if`/`elif`/`else`, and simple string handling.

## 📁 What's here

| Folder | What it covers |
|---|---|
| [Exercises XP](Exercises/ExercisesXP/) | Nine short exercises: printing, math, comparisons, odd/even, a name match and a ride height check. |
| [Exercises XP Gold](Exercises/ExercisesXPGold/) | String repetition and a month-to-season mapper with input validation. |
| [Exercises XP Ninja](Exercises/ExercisesXPNinja/) | PATH and the `py` launcher, boolean puzzles, counting characters, longest sentence without the letter A. |
| [Daily Challenge](DailyChallenge/) | "Build up a string": check a 10-character string, print its prefixes and shuffle it. |

## ▶️ Run

From the repository root:

```bash
python Week1Python/Day1StartingwithPython/Exercises/ExercisesXP/exercisesxp.py
python Week1Python/Day1StartingwithPython/Exercises/ExercisesXPGold/exercisesxpgold.py
python Week1Python/Day1StartingwithPython/Exercises/ExercisesXPNinja/exercisesxpninja.py
python Week1Python/Day1StartingwithPython/DailyChallenge/BuildUpAString/buildupastring.py
```

## 🧪 Tests

28 unit tests in [tests/python](../../tests/python/) cover this day: 10 for XP, 6 for Gold, 7 for Ninja and 5 for the daily challenge.

```bash
python -m unittest discover -s tests/python -p "test_week1_day1_*.py" -v
```

## 💡 What I learned

- `input()` always returns a string, so I convert with `int()` before comparing numbers.
- `3 == "3"` is `False`, and `"3" > 3` raises a `TypeError`.
- Boundaries matter: "over 145 cm" means `height > 145`, so 145 cm is not enough.
- String comparison is case-sensitive, so I normalize with `.strip().lower()`.
- `True` and `False` behave like `1` and `0` in arithmetic.

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)
