# 🥉 Exercises XP

<div align="center">

<img src="../../../../assets/readme/days/week1-day1-python-foundations.svg" width="100%" alt="Week 1 Day 1 Python foundations map: Exercises XP 1–9, XP Gold 1–2 and XP Ninja 1–5 are covered by 23 tests, and the Daily Challenge by 5 more.">

</div>

Nine short Day 1 exercises in [exercisesxp.py](exercisesxp.py). Each one is its own function (`exercise_1()` to `exercise_9()`) and `main()` runs them in order.

## ▶️ How to run

```bash
python exercisesxp.py
```

Shortened sample run:

```
Hello world
...
7762392
False
True
False
TypeError
False
I have a ASUS computer.
My name is Kevin, I'm 31 years old and my shoe size is 40.
Hello World
Enter a number: 4
Even
What is your name? Kevin
Hey, we have the same name! :)
Enter your height in cm: 150
✅ You are tall enough to ride! (150cm)
```

## 🎯 The challenge

1. **Hello World** - prints "Hello world" four times using `\n`.
2. **Some math** - calculates `(99**3) * 8` = 7762392.
3. **What is the output?** - compares values of different types; `"3" > 3` raises a `TypeError`, which I catch.
4. **Computer brand** - puts `computer_brand = "ASUS"` into a sentence.
5. **Your information** - builds a sentence from name, age and shoe size with `str()`.
6. **A & B** - prints "Hello World" if `a > b`.
7. **Odd or even** - reads a number and checks `n % 2`.
8. **What's your name?** - compares the input to my name after `.strip().lower()`.
9. **Tall enough to ride?** - uses `height > 145`, so 145 cm is not enough and 146 cm is.

Exercises 7 to 9 ask for input. A small `read_int()` helper keeps asking until it gets a whole number.

## 🧪 Tests

From the repository root:

```bash
python -m unittest discover -s tests/python -p "test_week1_day1_exercises_xp.py" -v
```

10 tests in [test_week1_day1_exercises_xp.py](../../../../tests/python/test_week1_day1_exercises_xp.py) cover the exercises, including invalid input and the 145/146 cm boundary.

## 🧠 What I learned

- `input()` returns text, so numbers need `int()` before any math or comparison
- Python won't compare `str` and `int` with `>`; it raises a `TypeError`
- "Over 145" is a strict `>`, not `>=`

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 1 Day 1 - Starting with Python - Exercises XP
