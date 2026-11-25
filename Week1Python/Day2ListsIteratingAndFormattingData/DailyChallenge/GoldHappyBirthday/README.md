# 🌟 Daily Challenge Gold - Happy Birthday

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/gold-happy-birthday-051524da32.svg" width="100%" alt="Progress card for Gold Happy Birthday">

</div>

You type your birthdate and [happybirthday.py](happybirthday.py) draws an ASCII cake. The number of candles is the last digit of your age.

## ▶️ How to run

```bash
python happybirthday.py
```

Someone who is 23 or 33 gets 3 candles:

```
       ___iii___
      |:H:a:p:p:y:|
    __|___________|__
   |^^^^^^^^^^^^^^^^^|
   |:B:i:r:t:h:d:a:y:|
   |                 |
   ~~~~~~~~~~~~~~~~~~~
```

The age comes from today's date on the computer, so the same birthdate can give a different cake next month.

## 🎯 The challenge

1. `main()` asks for the date as `DD/MM/YYYY`, for example `16/06/1994`.
2. `datetime.strptime(s, "%d/%m/%Y")` parses it. A wrong format or an impossible date like `31/02/2000` prints `Please use DD/MM/YYYY and ensure the date is valid.` and the program ends.
3. The age is the year difference minus one if the birthday hasn't happened yet this year:

   ```python
   age = today.year - bday.year - ((today.month, today.day) < (bday.month, bday.day))
   ```

4. `candles = age % 10`, so 31 gets one candle and 40 gets none.
5. `print_cake(candles)` draws it. When `calendar.isleap(bday.year)` is true, the cake is printed twice.

## 🧠 What I learned

- The `strptime()` codes I needed were `%d`, `%m` and `%Y`, and it raises `ValueError` for bad dates on its own
- Comparing `(month, day)` tuples gives `True` or `False`, and `True` counts as 1 when I subtract it
- `"i" * candles` builds the candle row, and zero candles still leaves a clean top line
- `calendar.isleap()` saved me from writing the divisible-by-4-but-not-100 rule myself

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 1 Day 2 - Lists, Iteration and Data Formatting - Daily Challenge Gold
