# ⏱️ Timed Challenge 2 - Perfect Number

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/timed-challenge2-a4265f7705.svg" width="100%" alt="Progress card for Timed Challenge2">

</div>

A tiny script in [perfectnumber.py](perfectnumber.py) that prints `True` if a number is a perfect number, otherwise `False`. A perfect number equals the sum of its proper divisors: 6 is perfect (1 + 2 + 3 = 6), 10 is not (1 + 2 + 5 = 8).

## ▶️ How to run

```bash
python perfectnumber.py
```

```
Enter the Number:6
True
```

```
Enter the Number:10
False
```

## 🎯 The challenge

`is_perfect(n)`:

1. Returns `False` for 1 and anything smaller.
2. Starts the total at 1, then checks divisors only up to `math.isqrt(n)`. Each divisor `i` also brings its partner `n // i`, and a square root is only counted once.
3. Stops early if the total is already bigger than `n`.

Input that is not a whole number prints `False`.

## 🧠 What I learned

- Divisors come in pairs, so checking up to the square root is enough
- `math.isqrt()` gives an exact integer square root
- An early exit saves work on numbers that are clearly not perfect

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 1 Day 3 - Dictionaries - Timed Challenge 2
