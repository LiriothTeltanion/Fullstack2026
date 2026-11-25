# 🥉 Exercises XP

<div align="center">

<img src="../../../../assets/readme/days/week1-day1-python-foundations.svg" width="100%" alt="Week 1 Day 1 Python foundations map: Exercises XP 1–9, XP Gold 1–2 and XP Ninja 1–5 are covered by 23 tests, and the Daily Challenge by 5 more.">

</div>

The nine core exercises of Day 1, all in [exercisesxp.py](exercisesxp.py). I gave each one its own function, `exercise_1()` to `exercise_9()`, and `main()` calls them in order.

## ▶️ How to run

```bash
python exercisesxp.py
```

A shortened run:

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

1. **Hello World**: four lines from one `print()` with `\n` in the string.
2. **Some math**: `(99**3) * 8`, which prints 7762392.
3. **What is the output?**: a few comparisons. `"3" > 3` crashes with a `TypeError`, so I wrapped it in `try`/`except` and print the error name.
4. **Computer brand**: `computer_brand = "ASUS"` glued into a sentence with `+`.
5. **Your information**: name, age and shoe size in one f-string.
6. **A & B**: prints "Hello World" only when `a > b`.
7. **Odd or even**: reads a number and checks `n % 2 == 0`.
8. **What's your name?**: compares the answer with `MY_NAME` after `.strip().lower()`, so " kevin " still matches.
9. **Tall enough to ride?**: `height > HEIGHT_REQUIREMENT_CM` with the limit at 145, so 145 cm fails and 146 cm passes. A rider who is too short is told how many centimetres are missing.

Exercises 7 and 9 use my `read_int()` helper. It keeps asking until it gets a whole number, and for the height it also rejects anything outside 0 to 300.

## 🧪 Tests

From the repository root:

```bash
python -m unittest discover -s tests/python -p "test_week1_day1_exercises_xp.py" -v
```

10 tests in [test_week1_day1_exercises_xp.py](../../../../tests/python/test_week1_day1_exercises_xp.py) go through the exercises, including bad input and the 145/146 cm edge.

## 🧠 What I learned

- `input()` always gives back a string, so I need `int()` before doing math with it
- Comparing a `str` and an `int` with `>` isn't allowed in Python 3, it raises `TypeError`
- "Taller than 145" means `>`, and writing `>=` would have let 145 cm ride
- Putting the retry loop in `read_int()` saved me from repeating the same `try` block twice

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 1 Day 1 - Starting with Python - Exercises XP
