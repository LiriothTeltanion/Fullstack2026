# 🏋️ Exercises XP - Functions Fundamentals

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xp-ae3b3197a6.svg" width="100%" alt="Progress card for Exercises XP">

</div>

Seven short exercises where I practiced writing functions: parameters, default values, the `random` module, changing a list inside a function, and returning values instead of printing them.

## ▶️ How to run

```bash
python exercisesxp.py
```

`main()` runs all seven exercises in order. Only the standard library is used (`random`). I used Python 3.10+.

## 📋 The exercises

| # | Function | What it practices |
|---|----------|-------------------|
| 1 | `display_message()` | Defining and calling a function |
| 2 | `favorite_book(title)` | One parameter and an f-string |
| 3 | `describe_city(city, country="Unknown")` | A default parameter |
| 4 | `compare_number(n)` | `random.randint(1, 100)` and an `if`/`else` |
| 5 | `make_shirt(size="large", text="I love Python")` | Two defaults, positional and keyword arguments |
| 6 | `show_magicians()` / `make_great()` | Changing a list in place |
| 7 | `get_random_temp()` / `get_temp_advice()` / `report_weather()` | Returning values and combining functions |

Some calls from `main()`:

```python
describe_city("Reykjavik", "Iceland")    # Reykjavik is in Iceland.
describe_city("Paris")                   # Paris is in Unknown.
make_shirt(size="small", text="Hello!")  # keyword arguments
```

For exercise 6, `main()` passes a copy (`magician_names.copy()`) to `make_great()`, so the original list is not changed. For exercise 7, the temperature thresholds are constants at the top of the file (`TEMP_FREEZING`, `TEMP_CHILLY`, `TEMP_NICE`, `TEMP_WARM`), and `get_temp_advice()` returns a message for each range, from "freezing" below 0 to "really hot" from 33 up.

## 🧠 What I learned

- Required parameters go first, optional ones with defaults go last
- A function that returns a value is easier to reuse than one that only prints
- Lists are mutable, so a function can change the caller's list; pass a copy if you don't want that
- Splitting work into small functions (generate, decide, display) keeps each one simple

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 1 Day 4 - Functions - Exercises XP
