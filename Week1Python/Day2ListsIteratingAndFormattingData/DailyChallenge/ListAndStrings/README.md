# 💪 Daily Challenge - Lists and Strings

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/list-and-strings-c081f54eec.svg" width="100%" alt="Progress card for List And Strings">

</div>

Two short problems in [dailychallengelistandstrings.py](dailychallengelistandstrings.py): make a list of multiples, and remove letters that repeat next to each other. I kept the prompts in a `_cli()` function, so importing the file doesn't ask for anything.

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

The docstring examples double as doctests: `python -m doctest -v dailychallengelistandstrings.py`.

## 🎯 The challenge

| Function | What it does |
|---|---|
| `multiples(number, length)` | `[number * i for i in range(1, length + 1)]`. `multiples(-3, 4)` gives `[-3, -6, -9, -12]`, a length of 0 gives `[]` and a negative length raises `ValueError`. |
| `collapse_duplicates(word)` | Keeps a letter only if it differs from the last one kept, so `"bookkeeper"` becomes `"bokeper"`. It is case-sensitive (`"AaAa"` stays) and repeats that aren't neighbours stay too (`"abca"`). |

One thing I noticed later: in `_cli()` the `ValueError` from a negative length is raised in the `else` part, outside the `try`, so typing `-1` as the length crashes the script instead of printing the friendly message.

## 🧠 What I learned

- `range(1, length + 1)` inside a comprehension gave me the whole list in one line
- To drop neighbours that repeat, I only need to look at `result[-1]`, not the whole word
- Starting `result` with `word[0]` meant I had to handle the empty string first
- Code in a `try`/`else` block isn't protected by the `except`, which is where my crash comes from

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 1 Day 2 - Lists, Iteration and Data Formatting - Daily Challenge
