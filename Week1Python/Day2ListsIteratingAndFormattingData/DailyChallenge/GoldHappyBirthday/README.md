# 💪 Daily Challenge GOLD — Happy Birthday

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/gold-happy-birthday-051524da32.svg" width="100%" alt="Progress card for Gold Happy Birthday">

</div>

A small program in [happybirthday.py](happybirthday.py) that asks for your birthdate and draws an ASCII birthday cake.

## 🎯 How it works

1. Asks for a birthdate as `DD/MM/YYYY` (for example `16/06/1994`).
2. Parses it with `datetime.strptime()`. If the format or the date is wrong, it prints a short message and stops.
3. Calculates the age from today's date:
   ```python
   age = today.year - bday.year - ((today.month, today.day) < (bday.month, bday.day))
   ```
4. Uses `age % 10` as the number of candles, so 31 gives one candle and 40 gives none.
5. Draws the cake. If the birth year is a leap year (`calendar.isleap()`), it draws it twice.

With 3 candles the cake looks like this:

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

## ▶️ Run

```bash
python happybirthday.py
```

## 💡 What I learned

- `strptime()` format codes: `%d` day, `%m` month, `%Y` year.
- Python compares tuples element by element, which makes the "birthday not reached yet" check one line.
- `"i" * candles` builds the candle row.

Ideas for later: show 10 candles on round birthdays (`age % 10 or 10`) and accept `DD-MM-YYYY` too.

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)
