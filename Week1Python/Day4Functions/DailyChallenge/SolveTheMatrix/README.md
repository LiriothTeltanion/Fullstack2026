# 💪 Daily Challenge - Solve The Matrix

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/solve-the-matrix-4caca0648d.svg" width="100%" alt="Progress card for Solve The Matrix">

</div>

There's a sentence hidden in a grid of letters and symbols. If I read the grid down each column and keep only the letters, it comes out. My solution is `decode_matrix()` in [solvethematrix.py](solvethematrix.py).

## ▶️ How to run

```bash
python solvethematrix.py
```

The output is one line: `This is Matrix`.

## 🎯 The challenge

The grid:

```
7ir
Tsi
h%x
i ?
sM# 
$a 
#t%
```

`decode_matrix()` works in two passes:

1. **Read by columns.** The outer loop goes over column numbers, the inner one over rows. The rows aren't all the same length, so I only read `r[c]` when `c < len(r)`.
2. **Clean up.** Letters are kept. Symbols before the first letter are skipped, a run of symbols between two letters becomes a single space, and symbols after the last letter are dropped.

```python
for c in range(cols):
    for r in rows:
        if c < len(r):
            col_read += r[c]
```

Column 1 gives `This`, column 2 gives `is Mat` and column 3 gives `rix`, which joins into `This is Matrix`.

## 🧠 What I learned

- Putting the column loop outside and the row loop inside is all it takes to read a grid sideways
- Uneven rows would raise `IndexError` without the `c < len(r)` check
- The `seen_letter` flag is what stops the leading `7` from turning into a space
- Looking ahead with a second index `j` let me tell "symbols between words" from "symbols at the end"

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 1 Day 4 - Functions - Daily Challenge
