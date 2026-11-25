# 🧩 Day 4 — Functions

<div align="center">

<img src="../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../assets/readme/progress/day4-functions-e1dfe1f6c2.svg" width="100%" alt="Progress card for Day4 Functions">

</div>

Day 4 of the Developers Institute bootcamp was about functions: parameters and defaults, return values, scope, `*args`, and splitting a problem into small reusable pieces. Each folder below has its own README with the details.

## 📁 What's in this folder

| Folder | What I practiced |
|--------|------------------|
| [ExercisesXP](Exercises/ExercisesXP/) | Seven warm-ups: defaults, keyword arguments, `random`, list mutation, a weather report |
| [ExercisesXPGold](Exercises/ExercisesXPGold/) | Retirement check with dates, X + XX + XXX + XXXX, a dice simulation |
| [ExercisesXPNinja](Exercises/ExercisesXPNinja/) | Name capitalization, Morse code, a star box with `*args`, insertion sort |
| [TimedChallenge1](Exercises/TimedChallenge1/) | Counting how many times a character appears in a string |
| [DailyChallenge/SolveTheMatrix](DailyChallenge/SolveTheMatrix/) | Reading a character grid by columns to find a hidden message |
| [DailyChallenge/CoffeeShopMenuManager](DailyChallenge/CoffeeShopMenuManager/) | A console menu manager where each action is its own function |

## ▶️ How to run

Every exercise is a single Python script using only the standard library. Go into its folder and run it, for example:

```bash
cd Exercises/ExercisesXP
python exercisesxp.py
```

## 🧠 Key concepts

```python
def describe_city(city, country="Unknown"):  # default parameter
    return f"{city} is in {country}."

def box_printer(*strings):                   # any number of arguments
    ...

describe_city("Paris")                       # uses the default
describe_city(city="Reykjavik", country="Iceland")  # keyword arguments
```

- Required parameters first, defaults last; positional arguments before keyword ones.
- Returning a value is more reusable than printing inside the function.
- A function without `return` gives back `None`.
- Variables created inside a function are local. I pass values in and return results instead of using `global`.
- Never use a mutable default like `items=[]`; use `None` and create the list inside.

## 🔗 Next

[Day 5 — Mini Project](../Day5MiniProject/)

This day's code is under the repository's [MIT License](../../LICENSE).

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
📂 Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
📅 Week 1 Day 4 - Functions
