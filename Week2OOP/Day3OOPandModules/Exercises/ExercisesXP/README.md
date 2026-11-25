# 🥉 Exercises XP

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xp-19dd687672.svg" width="100%" alt="Progress card for Exercises XP">

</div>

Seven XP exercises live in one script, `xp_oop_modules_all.py`. The first is about dunder methods, the other six each try a different module.

## ▶️ How to run

```bash
pip install faker   # optional, only for exercise 7
python xp_oop_modules_all.py
```

```text
===== Exercise 1: Currency dunder methods =====
5 dollars
5
5 dollars
10
15
5 dollars
10 dollars
20 dollars
TypeError: Cannot add between Currency type <dollar> and <shekel>

===== Exercise 2: 'Import' (inline function call) =====
Sum is: 20 ✅
...
```

Exercises 3 to 6 change on every run. Without Faker, exercise 7 just prints the install hint.

## 🎯 The challenge

1. **Currencies** - `Currency` defines `__str__`, `__repr__`, `__int__`, `__add__`, `__iadd__` and `__radd__`. A count of 1 prints `dollar`, anything else gets an `s`. Adding dollars to shekels raises `TypeError`
2. **Import** - `sum_two_numbers(7, 13)` prints `Sum is: 20`. The task wanted it in its own `func.py`, but I kept it in this file
3. **String module** - five picks from `string.ascii_letters` with `random.choice`
4. **Current date** - `date.today()` in ISO format
5. **Time until January 1st** - subtracts now from next year's January 1st and splits the `timedelta` into days, hours, minutes and seconds
6. **Minutes lived** - `strptime` reads `1994-06-16`, and `total_seconds() // 60` gives the minutes
7. **Faker** - `generate_users(n)` returns dicts with `name`, `address` and `language_code`

One leftover bug: `.replace("\n", ", ")` looks for a backslash and an `n`, not a newline, so addresses still print on two lines.

## 🧠 What I learned

- `c1 + c2`, `c1 += c2` and `5 + c1` end up in three different methods: `__add__`, `__iadd__` and `__radd__`
- `__add__` returns a plain number, while `__iadd__` changes the object and returns `self`
- A `timedelta` has no hours field, so I split its `seconds` into hours and minutes with `//` and `%`
- Putting `from faker import Faker` inside the function means the other six exercises run without it

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 2 Day 3 - OOP and Modules - Exercises XP
