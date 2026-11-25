# 🥉 Exercises XP

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xp-b86ef38f1a.svg" width="100%" alt="Progress card for Exercises XP">

</div>

Ten exercises in [exercisesxp.py](exercisesxp.py). The first half plays with sets, tuples and lists; the second half turns loops into small programs that take input.

## ▶️ How to run

```bash
python exercisesxp.py
```

Shortened sample (the set can print in a different order):

```
our_fav_numbers: {1, 3, 7, 42, 27, 13}
tuple: (1, 2, 3, 4, 5)
apples count: 2
final basket: []
sequence: [1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]
...
Sorry, no Pastrami today.
I made your Tuna sandwich.
I made your Avocado sandwich.
I made your Egg sandwich.
I made your Chicken sandwich.
Finished sandwiches: ['Tuna', 'Avocado', 'Egg', 'Chicken']
```

## 🎯 The challenge

1. **Favorite numbers**: I add 42 and 99 to my set, `.discard(99)` again, then `.union()` it with a friend's set.
2. **Tuple**: tuples can't change, so `t = t + (4, 5)` builds a new one.
3. **Basket**: `remove()`, `append("Kiwi")`, `insert(0, "Apples")`, `count("Apples")` and finally `clear()`.
4. **Floats**: a `while` loop from 1.5 to 5 in steps of 0.5. Whole values like `2.0` go in as `2` thanks to `is_integer()`.
5. **For loop**: 1 to 20, then only the items at even positions from `enumerate()`, which are the odd numbers.
6. **While loop**: keeps asking for a name until it is "Kevin", ignoring case and spaces.
7. **Favorite fruits**: `split()` the answer into a list and check if the chosen fruit is in it.
8. **Pizza toppings**: collects toppings until `quit`, skips empty ones, and `calculate_pizza_price()` charges $10 plus $2.50 each.
9. **Cinemax tickets**: ages until `done`. `calculate_ticket_price()` gives 0 under 3, $10 up to 12 and $15 after that. A second loop keeps only ages 16 to 21 for a restricted movie.
10. **Sandwich orders**: a `while "Pastrami" in sandwich_orders` loop removes every Pastrami, then `pop(0)` makes the rest in order.

Exercises 6 to 9 wait for keyboard input. Anything that isn't a whole number gets a warning instead of a crash.

## 🧠 What I learned

- A set throws away duplicates for me, but I can't rely on the order it prints in
- `.remove("Pastrami")` only deletes the first one, so I had to loop until none were left
- `enumerate()` counts from 0, so "even position" actually means the odd numbers 1, 3, 5
- `.isdigit()` was a quick way to check ticket ages before calling `int()`

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 1 Day 2 - Lists, Iteration and Data Formatting - Exercises XP
