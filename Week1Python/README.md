# 🐍 Week 1 — Python Fundamentals

<div align="center">

<img src="../assets/readme/days/week1-day1-python-foundations.svg" width="100%" alt="Week 1 Day 1 Python foundations map: Exercises XP 1–9, XP Gold 1–2 and XP Ninja 1–5 are covered by 23 tests, and the Daily Challenge by 5 more.">

</div>

My first week of the Developers Institute full-stack bootcamp was all plain Python: variables and conditionals on Day 1, then lists, dictionaries and functions, and two small console games on Day 5. Each day has XP exercises, optional Gold and Ninja extras, and a daily challenge.

## 🚀 Quickstart

Python 3.8 or newer is enough; there are no external packages. From the repository root:

```bash
python Week1Python/Day1StartingwithPython/Exercises/ExercisesXP/exercisesxp.py
python Week1Python/Day2ListsIteratingAndFormattingData/Exercises/ExercisesXP/exercisesxp.py
python Week1Python/Day5MiniProject/Exercises/TicTacToe/tictactoe.py
```

Most scripts are interactive and ask for input in the terminal.

## 📅 The week

| Day | Topic | What I built |
|---|---|---|
| [Day 1](Day1StartingwithPython/) | Starting with Python | Variables, types, `input()`/`print()`, conditionals and the "Build up a string" challenge. |
| [Day 2](Day2ListsIteratingAndFormattingData/) | Lists, iterating and formatting | Sets, tuples, lists, `for`/`while` loops, a pizza order and a cinema ticket calculator. |
| [Day 3](Day3Dictionaries/) | Dictionaries | `zip()` and `dict()`, nested data (Zara brand, Disney characters), timed challenges and a Caesar cipher. |
| [Day 4](Day4Functions/) | Functions | Parameters, defaults, return values and scope; the Solve the Matrix and Coffee Shop Menu Manager challenges. |
| [Day 5](Day5MiniProject/) | Mini projects | Tic-Tac-Toe, Hangman and a few extra algorithm challenges. |

## 🧪 Tests

Day 1 has focused unit tests in [tests/python](../tests/python/): 10 for XP, 6 for Gold, 7 for Ninja and 5 for the daily challenge. The Coffee Shop Menu Manager, Tic-Tac-Toe and Hangman have their own test files in the same folder.

```bash
python -m unittest discover -s tests/python -p "test_week1_day1_*.py" -v
```

## 💡 What I learned

- `input()` always returns a string, so numbers need `int()` or `float()` first.
- When to pick a list, a set, a tuple or a dictionary.
- Splitting a program into small functions makes it easier to test and to debug.
- Validating user input in a loop instead of letting the program crash.
- Putting it all together in a game loop with turns, win checks and replay.

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)
