# 🥇 Exercises XP Gold

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xpgold-58bc95ca32.svg" width="100%" alt="Progress card for Exercises XPGold">

</div>

Five tasks that lean on the standard library (`datetime`, `re`, `secrets`, `string`). Everything is in `exercisesxpgoldmodules.py`.

## ▶️ How to run

```bash
python exercisesxpgoldmodules.py
```

```text
Space age for 1,000,000,000 seconds:
  Earth   : 31.69 years
  Mercury : 131.57 years
...
Digits extracted: 532569

Name validation:
  'John Doe' -> True
  'john doe' -> False
...
Self-test passed: 100 generated passwords validated. ✅
```

Above that, two lines show today's date and the next holiday, so they depend on the day you run it.

## 🎯 The challenge

1. **Upcoming holiday** - `today_and_next_holiday()` asks the `holidays` package if it's installed. Without it, the function picks from a short built-in list (New Year, Valentine's, Labor Day, July 4th, Halloween, Christmas, New Year's Eve)
2. **Space age** - `space_age(seconds)` divides by one Earth year (31,557,600 s) times each planet's orbital period
3. **Regex #1** - `return_numbers("k5k3q2g5z6x9bn")` keeps only the digits with `re.findall(r"\d", s)` and returns `532569`
4. **Regex #2** - `is_valid_full_name()` wants two capitalized words with one space between them. `John  Doe` (two spaces) and `John D` both fail
5. **Password generator** - `generate_password(length)` accepts 6 to 30 characters and always has at least one digit, one lowercase, one uppercase and one special character

The interactive `password_cli()` is commented out on the last line, so the demo runs `password_self_test(100)` and never waits for input.

## 🧠 What I learned

- For passwords I used `secrets.SystemRandom()`, because plain `random` is predictable
- Picking one character from each group first and shuffling afterwards means every rule passes on the first try
- `"John D"` fails because `[a-z]+` needs at least one lowercase letter after the capital
- `password_self_test()` generates 100 passwords and `assert`s each one, a cheap way to test random output

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 2 Day 3 - OOP and Modules - Exercises XP Gold
