# 📦 Day 3 — OOP and Modules

<div align="center">

<img src="../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../assets/readme/progress/day3-oopand-modules-61faf7cdb6.svg" width="100%" alt="Progress card for Day3 OOPand Modules">

</div>

Day 3 mixed two things: dunder methods that let my classes work with Python's operators, and using modules from the standard library (and a couple of third-party ones) instead of writing everything myself.

## 📁 What's here

- [Exercises](Exercises/)
  - [ExercisesXP](Exercises/ExercisesXP/) — a `Currency` class with `__add__`, `__iadd__` and friends, random strings, dates with `datetime`, minutes lived, fake users with Faker
  - [ExercisesXPGold](Exercises/ExercisesXPGold/) — next holiday, age on other planets, two regex tasks and a password generator
  - [ExercisesXPNinja](Exercises/ExercisesXPNinja/) — temperature classes that convert and compare, and a playful `QuantumParticle`
- [Daily Challenge](DailyChallenge/)
  - [Circle](DailyChallenge/Circle/) — a `Circle` with radius/diameter properties, adding, comparing and sorting
  - [Translator](DailyChallenge/Translator/) — French to English with `googletrans`
  - [UserInfo](DailyChallenge/UserInfo/) — read `Name,Age,Score` records and sort them with a lambda

## 🚀 How to run

From this folder:

```bash
python Exercises/ExercisesXP/xp_oop_modules_all.py
python DailyChallenge/Circle/circle.py
python DailyChallenge/Translator/dailychallengetranslator.py
```

Some scripts use optional packages (`faker`, `googletrans`, `holidays`). They print a fallback if a package is missing.

## 💡 Key concepts

```python
class Currency:
    def __init__(self, currency, amount):
        self.currency = currency
        self.amount = amount

    def _label(self):
        return self.currency if self.amount == 1 else f"{self.currency}s"

    def __str__(self):
        return f"{self.amount} {self._label()}"

    def __add__(self, other):
        if isinstance(other, (int, float)):
            return int(self.amount + other)
        if isinstance(other, Currency):
            if self.currency != other.currency:
                raise TypeError(f"Cannot add between Currency type <{self.currency}> and <{other.currency}>")
            return int(self.amount + other.amount)
```

- `__str__` / `__repr__` control how an object prints
- `__add__`, `__lt__`, `__eq__` let objects use `+`, `<`, `==` and `sorted()`
- `@property` gives a computed attribute (diameter from radius) with a setter
- `import module`, `from module import name` and `as` aliases
- Handy modules: `random`, `string`, `datetime`, `re`

## 🎓 What I learned

Writing `__add__` myself made it clear that `a + b` is just a method call. I also learned to check the standard library before building something: `datetime` did all the hard work for the "time until New Year" and "minutes lived" tasks.

## 👤 Author

**Kevin "Lirioth" Cusnir**
https://github.com/LiriothTeltanion/Fullstack2026
