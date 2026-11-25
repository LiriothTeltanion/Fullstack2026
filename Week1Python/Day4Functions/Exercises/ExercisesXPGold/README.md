# 🥇 Exercises XP Gold

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xpgold-0aa5d263c3.svg" width="100%" alt="Progress card for Exercises XPGold">

</div>

Three function exercises in [xpgoldfunctions.py](xpgoldfunctions.py): checking if someone can retire, a small number series, and a dice simulation.

## ▶️ How to run

```bash
python xpgoldfunctions.py
```

The script asks for a gender and a date of birth (exercise 1), then a digit (exercise 2), and finally runs the dice experiment (exercise 3):

```
=== Exercise 1 ===
Gender (m/f): m
DOB (yyyy/mm/dd): 1955/05/03
You can retire.

=== Exercise 2 ===
Enter a digit X: 3
Result: 3702

=== Exercise 3 ===
Total throws: 658
Average throws to reach doubles: 6.58
```

The dice numbers change every run; uncomment `random.seed(0)` in the script to get the same result each time.

## 🎯 The challenge

| Function | What it does |
|---|---|
| `get_age(year, month, day)` | Returns the age in whole years and subtracts one if the birthday hasn't happened yet this year. |
| `can_retire(gender, date_of_birth)` | Parses a `yyyy/mm/dd` date and compares the age with the retirement age (men 67, women 62). Any gender other than `m` or `f` raises a `ValueError`. |
| `series_sum(x)` | Builds X + XX + XXX + XXXX with string repetition: `sum(int(str(x) * k) for k in range(1, 5))`, so `series_sum(3)` is 3 + 33 + 333 + 3333 = 3702. |
| `throw_dice()` | Returns a number from 1 to 6. |
| `throw_until_doubles()` | Throws two dice until they match and returns how many throws it took. `main()` repeats it 100 times and prints the total and the average with two decimals. |

The exercise asked for a hard-coded "today". I used `datetime.date.today()` instead, with a `TODAY_OVERRIDE` constant so a fixed date can be set for testing.

## 🧠 What I learned

- Comparing `(month, day)` tuples is an easy way to check if a birthday already passed
- `map(int, text.split("/"))` turns a date string into numbers
- A `while True` loop with a `return` inside works well when I don't know how many tries it will take
- Raising `ValueError` for bad input is clearer than returning a wrong answer

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 1 Day 4 - Functions - Exercises XP Gold
