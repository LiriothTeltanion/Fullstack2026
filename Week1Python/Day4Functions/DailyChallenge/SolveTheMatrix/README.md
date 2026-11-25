# 💪 Daily Challenge - Solve The Matrix

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/solve-the-matrix-4caca0648d.svg" width="100%" alt="Progress card for Solve The Matrix">

</div>

A hidden message is spread over a grid of characters. Reading it column by column and keeping only the letters reveals the sentence.

## ▶️ How to run

```bash
python solvethematrix.py
```

It prints `This is Matrix`.

## 🎯 The challenge

```
7ir
Tsi
h%x
i ?
sM# 
$a 
#t%
```

`decode_matrix()` does it in two steps:

1. **Read column by column**, top to bottom, left to right. Some rows are shorter than others, so I check `c < len(r)` before reading a character.
2. **Clean the text**: keep the letters, skip any symbols before the first letter, and turn each group of symbols between letters into one space. Symbols at the very end are dropped.

```python
for c in range(cols):
    for r in rows:
        if c < len(r):
            col_read += r[c]
```

Column 1 gives `This`, column 2 gives `is Mat` and column 3 gives `rix`, so the result is `This is Matrix`.

## 🧠 What I learned

- Swapping the loop order (columns outside, rows inside) reads a grid by columns
- Checking the row length avoids an `IndexError` when rows have different lengths
- A simple flag like `seen_letter` helps decide when a symbol should become a space
- `str.isalpha()` is an easy filter for letters

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 1 Day 4 - Functions - Daily Challenge
