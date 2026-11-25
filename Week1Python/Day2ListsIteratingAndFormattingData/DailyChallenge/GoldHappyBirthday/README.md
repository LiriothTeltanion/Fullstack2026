# 🌟 Daily Challenge Gold - Happy Birthday

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/gold-happy-birthday-051524da32.svg" width="100%" alt="Progress card for Gold Happy Birthday">

</div>

A small program in [happybirthday.py](happybirthday.py) that asks for your birthdate and draws an ASCII birthday cake with one candle per last digit of your age.

## ▶️ How to run

```bash
python happybirthday.py
```

For someone who is 23 or 33 (3 candles) the cake looks like this:

```
       ___iii___
      |:H:a:p:p:y:|
    __|___________|__
   |^^^^^^^^^^^^^^^^^|
   |:B:i:r:t:h:d:a:y:|
   |                 |
   ~~~~~~~~~~~~~~~~~~~
```

The age depends on your computer's date, so the cake can change from day to day.

## 🎯 The challenge

1. Ask for a birthdate as `DD/MM/YYYY` (for example `16/06/1994`).
2. Parse it with `datetime.strptime()`. If the format or the date is wrong, print a short message and stop.
3. Calculate the age from today's date:
   ```python
   age = today.year - bday.year - ((today.month, today.day) < (bday.month, bday.day))
   ```
4. Use `age % 10` as the number of candles, so 31 gives one candle and 40 gives none.
5. Draw the cake. If the birth year is a leap year (`calendar.isleap()`), draw it twice.

## 🧠 What I learned

- `strptime()` format codes: `%d` day, `%m` month, `%Y` year
- Python compares tuples element by element, which makes the "birthday not reached yet" check one line
- `"i" * candles` builds the candle row

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 1 Day 2 - Lists, Iteration and Data Formatting - Daily Challenge Gold
