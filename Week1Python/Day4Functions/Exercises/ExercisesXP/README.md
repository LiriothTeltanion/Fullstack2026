# 🥉 Exercises XP

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xp-ae3b3197a6.svg" width="100%" alt="Progress card for Exercises XP">

</div>

My first real practice with writing functions, seven exercises in [exercisesxp.py](exercisesxp.py). They go from a function that only prints a line to a small weather report built from three functions that pass values to each other.

## ▶️ How to run

```bash
python exercisesxp.py
```

`main()` runs all seven. The random number and the temperature come from `random`, so those lines change every time:

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
| `display_message()` | Prints one sentence. Just defining and calling. |
| `favorite_book(title)` | One parameter dropped into an f-string. |
| `describe_city(city, country="Unknown")` | A default value, so `describe_city("Paris")` prints "Paris is in Unknown." |
| `compare_number(n)` | Compares `n` with `random.randint(1, 100)` and prints `Success!` or both numbers. |
| `make_shirt(size="large", text="I love Python")` | Called four ways in `main()`: no arguments, one positional, two positional, and with keywords. |
| `show_magicians()` / `make_great()` | `make_great()` adds " the Great" to every name in place. `main()` hands it `magician_names.copy()`, so the list at the top of the file stays untouched. |
| `get_random_temp()` / `get_temp_advice()` / `report_weather()` | One makes a temperature between -10 and 40, one turns it into advice, one prints both. The limits are constants (`TEMP_FREEZING`, `TEMP_CHILLY`, `TEMP_NICE`, `TEMP_WARM`), from "freezing" below 0 to "really hot" at 33 and up. |

## 🧠 What I learned

- Parameters with defaults have to come after the ones without
- `get_temp_advice()` returns a string instead of printing, so I can reuse or test it on its own
- A function can change a list it receives, and `.copy()` is how I avoid that when I don't want it
- Naming the temperature limits made the `if`/`elif` chain much easier to adjust

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 1 Day 4 - Functions - Exercises XP
