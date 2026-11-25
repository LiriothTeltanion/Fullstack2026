# 💪 Daily Challenge - Lists and Strings

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/list-and-strings-c081f54eec.svg" width="100%" alt="Progress card for List And Strings">

</div>

Two small problems in [dailychallengelistandstrings.py](dailychallengelistandstrings.py): generating multiples and cleaning repeated letters. The interactive part sits in a `_cli()` function, so I can import the helpers without triggering any prompts.

## ▶️ How to run

```bash
python dailychallengelistandstrings.py
```

```
Enter a number: 7
Enter length: 5
[7, 14, 21, 28, 35]
Enter a word: ppoollee
pole
```

The examples in the docstrings also run as doctests: `python -m doctest -v dailychallengelistandstrings.py`.

## 🎯 The challenge

| Function | What it does |
|---|---|
| `multiples(number, length)` | Returns the first `length` multiples: `[number * i for i in range(1, length + 1)]`. Negative numbers work (`multiples(-3, 4)` gives `[-3, -6, -9, -12]`), a length of 0 gives `[]`, and a negative length raises `ValueError`. |
| `collapse_duplicates(word)` | Collapses letters that repeat next to each other: `"bookkeeper"` gives `"bokeper"`. It is case-sensitive, so `"AaAa"` stays the same, and repeats that are not next to each other stay too (`"abca"`). |

## 🧠 What I learned

- A list comprehension with `range(1, length + 1)` replaces a whole loop
- Comparing each character with the last one I kept is enough to drop neighbours that repeat
- Small pure functions are easy to test with doctests

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 1 Day 2 - Lists, Iteration and Data Formatting - Daily Challenge
