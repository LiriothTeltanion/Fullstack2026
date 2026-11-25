# 🥇 Exercises XP Ninja — Formulas, Lists and Text

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xpninja-cdf5889bed.svg" width="100%" alt="Progress card for Exercises XPNinja">

</div>

Four harder Day 2 exercises in [exercisesxpninja.py](exercisesxpninja.py), using only the standard library. The script asks for input in Exercises 1 and 4 and prints everything else on its own.

## 1️⃣ Formula

`q_values()` computes `Q = sqrt((2 * C * D) / H)` with `C = 50` and `H = 30` for each comma-separated `D`, rounded to an integer.

```
Enter D values (comma-separated): 100,150,180
18,22,24
```

## 2️⃣ Playing with a list of integers

`number_report()` works on `[3, 47, 99, -80, 22, 97, 54, -23, 5, 7]` and prints the list, the list sorted high to low, the sum, the first and last items, numbers above 50 and below 10, the squares, the list without duplicates and its length, and the average, max and min. As a bonus it also calculates sum, average, max and min by hand with a loop.

## 3️⃣ Working on a paragraph

`analyse_paragraph()` counts characters, sentences (`.`, `!`, `?`), words, unique words (lowercased, punctuation stripped), non-whitespace characters, average words per sentence and how many words repeat. If no sentence ending is found it counts one sentence, so there's no division by zero.

## 4️⃣ Word frequency

`word_frequency()` counts each word in a line. It splits on whitespace only and is case-sensitive, so `Python` and `python` are different, and so are `fun,` and `fun`.

```
Enter a line for word frequency: Python python is fun, fun python
Python:1
fun:1
fun,:1
is:1
python:2
```

## ▶️ Run

```bash
python exercisesxpninja.py
```

## 💡 What I learned

- `collections.Counter` does word counting in one line.
- Writing max, min and sum by hand shows what the built-ins do for me.
- Returning a dictionary from a function keeps related results together.

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)
