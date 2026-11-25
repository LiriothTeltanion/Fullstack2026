# 🥇 Exercises XP Gold

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xpgold-29cf741779.svg" width="100%" alt="Progress card for Exercises XPGold">

</div>

Nine extra Day 2 exercises in [exercisesxpgold.py](exercisesxpgold.py): more list practice, ranges, `index()`, `max()` and a guessing game.

## ▶️ How to run

```bash
python exercisesxpgold.py
```

Shortened sample:

```
exercise1: [1, 2, 3, 4, 5, 6]
1505
1540
1575
...
The greatest number is: 42
a - vowel
b - consonant
...
min: 1, max: 1000000, sum: 500000500000
['12', '7', '33']
('12', '7', '33')
Guess 1-9 (or 'q' to quit): 5
better luck next time (number was 9 )
Guess 1-9 (or 'q' to quit): q
games won: 0 games lost: 1
```

## 🎯 The challenge

1. **Concatenate lists without `+`** - copy with `list(a)` and add the rest with `.extend(b)`.
2. **Multiples of 5 and 7** - prints every number from 1500 to 2500 divisible by both (so by 35).
3. **Check the index** - asks for a name and prints its first index with `.index()`, or "name not found".
4. **Greatest number** - reads three integers and prints `max(x, y, z)`.
5. **The alphabet** - labels each letter as a vowel (`aeiou`) or a consonant; `y` counts as a consonant.
6. **Words and letters** - collects 7 words and one character, then prints where the character first appears in each word with `.find()`.
7. **Min, max, sum** - for 1 to 1,000,000. Instead of building a list of a million items, I use the Gauss formula `n * (n + 1) // 2`.
8. **List and tuple** - turns comma-separated input into a list and a tuple of strings.
9. **Guessing game** - guess a number from 1 to 9 or type `q` to quit; it counts wins and losses and rejects invalid input.

Exercises 3, 4, 6, 8 and 9 ask for input.

## 🧠 What I learned

- `extend()` changes the list in place, so I copy first if I need the original
- Checking `if name in names` before `.index()` avoids a `ValueError`
- Choosing the right formula can replace a huge loop

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 1 Day 2 - Lists, Iteration and Data Formatting - Exercises XP Gold
