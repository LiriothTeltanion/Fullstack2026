# 🥉 Exercises XP

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xp-ae3b3197a6.svg" width="100%" alt="Progress card for Exercises XP">

</div>

Seven short exercises in [exercisesxp.py](exercisesxp.py) where I practiced writing functions: parameters, default values, the `random` module, changing a list inside a function, and returning values instead of printing them.

## ▶️ How to run

```bash
python exercisesxp.py
```

`main()` runs all seven exercises in order. Only the standard library is used (`random`), so the number guess and the temperature change every run:

```
I am learning about functions in Python.
One of my favorite books is Alice in Wonderland.
Reykjavik is in Iceland.
Paris is in Unknown.
Fail! Your number: 50, Random number: 32
The size of the shirt is large and the text is I love Python.
...
Harry Houdini the Great
...
🌡️ The temperature right now is -4 degrees Celsius.
🥶 Brrr, that's freezing! Wear some extra layers today.
```

## 🎯 The challenge

| Function | What it does |
|---|---|
| `display_message()` | Defining and calling a function. |
| `favorite_book(title)` | One parameter and an f-string. |
| `describe_city(city, country="Unknown")` | A default parameter. |
| `compare_number(n)` | Compares `n` with `random.randint(1, 100)`. |
| `make_shirt(size="large", text="I love Python")` | Two defaults, called with positional and keyword arguments. |
| `show_magicians()` / `make_great()` | Changes a list in place. `main()` passes a copy (`magician_names.copy()`), so the original list stays the same. |
| `get_random_temp()` / `get_temp_advice()` / `report_weather()` | Returns values and combines functions. The thresholds are constants at the top of the file (`TEMP_FREEZING`, `TEMP_CHILLY`, `TEMP_NICE`, `TEMP_WARM`), from "freezing" below 0 to "really hot" from 33 up. |

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
