# 💪 Daily Challenge - Build Up a String

<div align="center">

<img src="../../../../assets/readme/days/week1-day1-python-foundations.svg" width="100%" alt="Week 1 Day 1 Python foundations map: Exercises XP 1–9, XP Gold 1–2 and XP Ninja 1–5 are covered by 23 tests, and the Daily Challenge by 5 more.">

</div>

The program in [buildupastring.py](buildupastring.py) asks for a string and only goes on if it is exactly 10 characters long. Then it prints the string growing one letter per line and finishes with a shuffled copy.

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

The jumbled line is different every time I run it.

## 🎯 The challenge

I split it into three functions and a `main()`:

| Function | What it does |
|---|---|
| `validate_length(text)` | Returns `(False, "String not long enough.")`, `(False, "String too long.")` or `(True, "Perfect string")`. |
| `build_up_text(text)` | Adds one character per loop step to `built` and prints it. |
| `jumble_text(text)` | Shuffles `list(text)` with `random.shuffle()` and joins it back. |
| `main()` | Prints the message, stops if the length is wrong, else prints the first and last characters and calls the other two. |

## 🧪 Tests

From the repository root:

```bash
python -m unittest discover -s tests/python -p "test_week1_day1_daily_challenge.py" -v
python -m doctest -v Week1Python/Day1StartingwithPython/DailyChallenge/BuildUpAString/buildupastring.py
```

5 tests in [test_week1_day1_daily_challenge.py](../../../../tests/python/test_week1_day1_daily_challenge.py) try 9, 10 and 11 characters, check the build-up lines and make sure the shuffle keeps the same letters.

## 🧠 What I learned

- `s[0]` is the first character and `s[-1]` the last, so I don't need the length for either
- Returning a `(bool, message)` tuple let `main()` print the message and decide whether to stop
- Strings can't be shuffled in place, so `jumble_text()` works on `list(text)` and joins it again
- A random result can still be tested: I compare the sorted letters instead of the order

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 1 Day 1 - Starting with Python - Daily Challenge
