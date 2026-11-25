# 🛠️ Day 3 Exercises – OOP and Modules

## 📦 What's Inside

This folder focuses on the **seven XP exercises** that live inside [`xp_oop_modules_all.py`](ExercisesXP/xp_oop_modules_all.py). The script bundles every activity into one runnable file so you can review object-oriented patterns and module usage in a single place.

### ✅ Exercise Checklist
1. **Currency Dunder Methods** – Build a `Currency` class that implements string/int conversions plus `+`, `+=`, and right-hand addition safeguards.
2. **Inline Import Practice** – Define `sum_two_numbers` directly in the combined script to mimic importing from a helper module.
3. **Random String Utility** – Generate a five-letter string using the standard library `string` and `random` modules.
4. **Current Date Reporter** – Display today's date via `datetime.date.today()`.
5. **Countdown to New Year** – Calculate the remaining time until the next January 1st using `datetime.datetime` arithmetic.
6. **Minutes Lived Calculator** – Convert a birthdate string to elapsed minutes with `datetime.strptime` and `timedelta.total_seconds`.
7. **Fake User Generator** – Optionally install `faker` to build a list of mock users (name, address, language code).

Each routine has a tiny demo call inside `run_all_demos()` so you can see expected console output immediately.

## ▶️ How to Run the Combined Script

From the `ExercisesXP` directory (or any location after adjusting the path), run:

```bash
python xp_oop_modules_all.py
```

You'll see the exercises execute in order with descriptive printouts. Install the `faker` package if you want to preview the fake user list:

```bash
pip install faker
```

## 🛠️ Customize the Demos

Open the script and tweak the arguments in `run_all_demos()`—for example, update the birthdate, change how many fake users are generated, or replace the currency labels. Every function is self-contained, so you can also import them into your own projects for experimentation.

Happy coding! 🐍💙
