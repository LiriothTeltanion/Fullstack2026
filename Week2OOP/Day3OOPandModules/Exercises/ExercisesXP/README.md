# 🥉 Exercises XP

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xp-19dd687672.svg" width="100%" alt="Progress card for Exercises XP">

</div>

All seven XP exercises on dunder methods and modules in one script, `xp_oop_modules_all.py`.

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

The random string, the dates and the minutes change on every run. Without Faker, exercise 7 prints how to install it.

## 🎯 The challenge

1. **Currencies** - a `Currency` class with `__str__`, `__repr__`, `__int__`, `__add__`, `__iadd__` and `__radd__`; adding two different currencies raises `TypeError`
2. **Import** - `sum_two_numbers(a, b)`; the task asked for a separate `func.py`, but I kept the function in the same script
3. **String module** - a random 5-letter string from `string.ascii_letters` and `random.choice`
4. **Current date** - today's date with `date.today()`
5. **Time until January 1st** - days, hours, minutes and seconds left, from a `datetime` subtraction
6. **Minutes lived** - parses a birthdate with `strptime` and divides `total_seconds()` by 60
7. **Faker** - `generate_users(n)` builds a list of fake users with a name, an address and a language code

## 🧠 What I learned

- `a + b`, `a += b` and `5 + a` call three different dunder methods
- `__radd__` is what makes a number on the left side of `+` work
- Subtracting two `datetime` objects gives a `timedelta` I can split into units
- Importing an optional package inside a function keeps the script running without it

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 2 Day 3 - OOP and Modules - Exercises XP
