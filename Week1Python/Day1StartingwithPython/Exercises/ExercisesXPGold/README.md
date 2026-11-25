# 🥇 Exercises XP Gold

<div align="center">

<img src="../../../../assets/readme/days/week1-day1-python-foundations.svg" width="100%" alt="Week 1 Day 1 Python foundations map: Exercises XP 1–9, XP Gold 1–2 and XP Ninja 1–5 are covered by 23 tests, and the Daily Challenge by 5 more.">

</div>

Two bonus exercises in [exercisesxpgold.py](exercisesxpgold.py). One prints eight lines with a single `print()`, the other asks for a month and answers with its season.

## ▶️ How to run

```bash
python exercisesxpgold.py
```

```
Hello world
...
I love python
Enter month (1-12): 0
Month must be between 1 and 12.
Enter month (1-12): 4
Spring
```

## 🎯 The challenge

1. **Hello World - I love Python**: the whole thing is one line, using string multiplication:

   ```python
   print("Hello world\n" * 4 + "I love python\n" * 3 + "I love python")
   ```

   I add the last "I love python" on its own, without `\n`, so there is no empty line at the end.

2. **What is the season?**: `get_valid_month()` loops until it gets a whole number between 1 and 12 (text prints `Please enter a whole number.`). Then `get_season()` checks which tuple the month is in:

   ```python
   if month in SPRING_MONTHS:
       return "Spring"
   elif month in SUMMER_MONTHS:
       return "Summer"
   elif month in AUTUMN_MONTHS:
       return "Autumn"
   return "Winter"
   ```

   The tuples are constants at the top of the file, like `SPRING_MONTHS = (3, 4, 5)`. If `get_season()` gets a bad month it raises `ValueError` instead of quietly saying "Winter".

## 🧪 Tests

From the repository root:

```bash
python -m unittest discover -s tests/python -p "test_week1_day1_exercises_xp_gold.py" -v
```

6 tests in [test_week1_day1_exercises_xp_gold.py](../../../../tests/python/test_week1_day1_exercises_xp_gold.py) check the exact eight lines, all 12 months, invalid values and the retry loop.

## 🧠 What I learned

- `"text\n" * 4` repeats a string, which beats writing four `print()` calls
- `month in (3, 4, 5)` is shorter than `month == 3 or month == 4 or month == 5`
- Named tuples like `WINTER_MONTHS` make the `if` chain read almost like English
- Keeping the input loop apart from `get_season()` meant I could test the season logic without typing anything

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 1 Day 1 - Starting with Python - Exercises XP Gold
