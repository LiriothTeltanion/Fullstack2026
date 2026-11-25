# 🧩 Challenges 2

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/challenges2-e9acc2f59e.svg" width="100%" alt="Progress card for Challenges2">

</div>

Two exercises here. The first draws star patterns with loops. The second gave me a short piece of sorting code and asked what it does, so I traced it. [main.py](main.py) runs both, and the code is in [src/patterns.py](src/patterns.py) and [src/ex2analysis.py](src/ex2analysis.py).

## ▶️ How to run

From this folder:

```bash
python main.py
```

```
-> Pattern A
  *
 ***
*****
-> Pattern B
    *
   **
  ***
 ****
*****
...
Final Output: [2, 12, 24, 233, 354]
```

## 🎯 The challenge

**Exercise 1: Patterns.** `pattern_a()` is a pyramid, `pattern_b()` a triangle leaning right, and `pattern_c()` grows from one star to five and then shrinks back, pushed to the right. Every line is just `" " * n` plus `"*" * m`. Each function prints the pattern and also returns it as a string. For the pyramid, row `i` gets `h - i` spaces and `2 * i - 1` stars:

```python
for i in range(1, h + 1):
    spaces = " " * (h - i)
    stars = "*" * (2 * i - 1)
    lines.append(spaces + stars)
```

`pattern_c()` prints the five-star line twice, once at the end of the growing part and once at the start of the shrinking part. I left it like that.

**Exercise 2: Code analysis.** The given code:

```python
my_list = [2, 24, 12, 354, 233]
for i in range(len(my_list) - 1):
    minimum = i
    for j in range(i + 1, len(my_list)):
        if (my_list[j] < my_list[minimum]):
            minimum = j
            if (minimum != i):
                my_list[i], my_list[minimum] = my_list[minimum], my_list[i]
print(my_list)
```

It's a kind of selection sort, except it swaps every time it finds something smaller instead of once after the inner loop. In `ex2analysis.py` I wrote a commented copy of it and a function that records `i`, `j`, `minimum` and the list after each comparison or swap. The trace shows only two swaps happen, and the result is `[2, 12, 24, 233, 354]`.

## 🧠 What I learned

- Each pattern came down to a formula for spaces and stars per row
- Returning the pattern as a string, not only printing it, means a test can compare it
- Recording each step of the sort made it obvious where the swaps happen
- The swap inside the `if` still sorts this list, but it moves values more often than real selection sort

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 1 Day 5 - Mini-projects - Challenges 2
