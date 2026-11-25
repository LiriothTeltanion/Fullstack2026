# 🥷 Exercises XP Ninja

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xpninja-cdf5889bed.svg" width="100%" alt="Progress card for Exercises XPNinja">

</div>

Four harder Day 2 exercises in [exercisesxpninja.py](exercisesxpninja.py), using only the standard library: a formula, list statistics, paragraph analysis and word frequency.

## ▶️ How to run

```bash
python exercisesxpninja.py
```

The script asks for input in Exercises 1 and 4 and prints everything else on its own:

```
Enter D values (comma-separated): 100,150,180
18,22,24
list: 3 47 99 -80 22 97 54 -23 5 7
desc: 99 97 54 47 22 7 5 3 -23 -80
sum: 231
...
Enter a line for word frequency: Python python is fun, fun python
Python:1
fun:1
fun,:1
is:1
python:2
```

## 🎯 The challenge

| Function | What it does |
|---|---|
| `q_values()` | Computes `Q = sqrt((2 * C * D) / H)` with `C = 50` and `H = 30` for each comma-separated `D`, rounded to an integer. |
| `number_report()` | Works on `[3, 47, 99, -80, 22, 97, 54, -23, 5, 7]`: sorted list, sum, first and last items, numbers above 50 and below 10, squares, no duplicates, average, max and min. As a bonus it also calculates sum, average, max and min by hand with a loop. |
| `analyse_paragraph()` | Counts characters, sentences (`.`, `!`, `?`), words, unique words, non-whitespace characters, average words per sentence and repeated words. With no sentence ending it counts one sentence, so there's no division by zero. |
| `word_frequency()` | Counts each word in a line. It splits on whitespace only and is case-sensitive, so `Python` and `python` are different, and so are `fun,` and `fun`. |

## 🧠 What I learned

- `collections.Counter` does word counting in one line
- Writing max, min and sum by hand shows what the built-ins do for me
- Returning a dictionary from a function keeps related results together

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 1 Day 2 - Lists, Iteration and Data Formatting - Exercises XP Ninja
