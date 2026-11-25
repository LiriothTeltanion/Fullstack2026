# 🥇 Exercises XP Gold — String Repetition and Seasons

<div align="center">

<img src="../../../../assets/readme/days/week1-day1-python-foundations.svg" width="100%" alt="Week 1 Day 1 Python foundations map: Exercises XP 1–9, XP Gold 1–2 and XP Ninja 1–5 are covered by 23 tests, and the Daily Challenge by 5 more.">

</div>

Two extra Day 1 exercises in [exercisesxpgold.py](exercisesxpgold.py).

## 1️⃣ Hello World — I love Python

One single `print()` builds all eight lines with string multiplication:

```python
print("Hello world\n" * 4 + "I love python\n" * 3 + "I love python")
```

The last "I love python" is added without `\n`, so the output ends cleanly.

## 2️⃣ What is the season?

The program asks for a month number (1–12) and prints the season. `get_valid_month()` keeps asking until the input is a whole number in range, and `get_season()` maps the month with tuple membership:

```python
if m in (3, 4, 5):
    return "Spring"
elif m in (6, 7, 8):
    return "Summer"
elif m in (9, 10, 11):
    return "Autumn"
elif m in (12, 1, 2):
    return "Winter"
else:
    raise ValueError("month must be between 1 and 12")
```

```
Enter month (1-12): 0
Month must be between 1 and 12.
Enter month (1-12): 4
Spring
```

## ▶️ Run

```bash
python exercisesxpgold.py
```

## 🧪 Tests

6 tests in [tests/python/test_week1_day1_exercises_xp_gold.py](../../../../tests/python/test_week1_day1_exercises_xp_gold.py) check the exact repeated output, all 12 months, invalid values and the retry loop. From the repository root:

```bash
python -m unittest discover -s tests/python -p "test_week1_day1_exercises_xp_gold.py" -v
```

## 💡 What I learned

- `"text\n" * n` replaces a pile of `print()` calls.
- `if m in (3, 4, 5)` reads better than chaining `or`.
- Keeping validation in its own function makes it easy to reuse and test.

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)
