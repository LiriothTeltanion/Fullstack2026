# ⏱️ Timed Challenge 2 - Perfect Number

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/timed-challenge2-a4265f7705.svg" width="100%" alt="Progress card for Timed Challenge2">

</div>

[perfectnumber.py](perfectnumber.py) prints `True` when a number is perfect and `False` when it isn't. Perfect means the number equals the sum of its divisors without itself: 6 works (1 + 2 + 3), 10 doesn't (1 + 2 + 5 = 8).

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

How `is_perfect(n)` works:

1. 1 and anything below it are `False` straight away.
2. `total` starts at 1, because 1 divides every number above 1.
3. The loop only goes from 2 to `math.isqrt(n)`. When `i` divides `n`, I add both `i` and `n // i`, unless they are the same number (a perfect square), so it isn't counted twice.
4. If `total` gets bigger than `n` the function returns `False` early.

`main()` wraps `int(input(...))` in a `try`, so typing letters prints `False` instead of crashing.

## 🧠 What I learned

- Divisors come in pairs around the square root, so I only loop up to `isqrt(n)`
- The square case (`other != i`) is easy to miss and would make 4 look like it has divisors 1 + 2 + 2
- Returning as soon as the total passes `n` skips a lot of work on big numbers

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 1 Day 3 - Dictionaries - Timed Challenge 2
