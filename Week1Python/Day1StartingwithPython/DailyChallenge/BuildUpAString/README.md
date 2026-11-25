# 💪 Daily Challenge - Build Up a String

<div align="center">

<img src="../../../../assets/readme/days/week1-day1-python-foundations.svg" width="100%" alt="Week 1 Day 1 Python foundations map: Exercises XP 1–9, XP Gold 1–2 and XP Ninja 1–5 are covered by 23 tests, and the Daily Challenge by 5 more.">

</div>

My solution to the Day 1 daily challenge, in [buildupastring.py](buildupastring.py): it checks that a string has exactly 10 characters, then builds it up one character at a time and shuffles it.

## ▶️ How to run

```bash
python buildupastring.py
```

```
Enter a string (must be exactly 10 characters): abcdefghij
Perfect string
First character: a
Last character: j
a
ab
abc
...
abcdefghij
Jumbled string: acbdgfheji
```

The jumbled string changes on every run.

## 🎯 The challenge

1. Ask for a string.
2. Check the length: fewer than 10 characters prints "String not long enough.", more than 10 prints "String too long.", and exactly 10 prints "Perfect string" and continues.
3. Print the first and last characters.
4. Use a `for` loop to print the string growing one character per line.
5. Bonus: print a shuffled version with the same characters.

## 🧪 Tests

From the repository root:

```bash
python -m unittest discover -s tests/python -p "test_week1_day1_daily_challenge.py" -v
python -m doctest -v Week1Python/Day1StartingwithPython/DailyChallenge/BuildUpAString/buildupastring.py
```

5 tests in [test_week1_day1_daily_challenge.py](../../../../tests/python/test_week1_day1_daily_challenge.py) check the 9, 10 and 11 character boundaries, the build-up output and that the shuffle keeps the same characters.

## 🧠 What I learned

- `s[0]` and `s[-1]` give the first and last characters
- Adding one character per loop step (`built += ch`) builds the prefixes
- `random.shuffle()` works on a list, so I convert the string to a list and join it back

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 1 Day 1 - Starting with Python - Daily Challenge
