# 🧪 Remote Exercise - Fibonacci

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/fibonacci-0de74eae6c.svg" width="100%" alt="Progress card for Fibonacci">

</div>

[fibonacci.py](fibonacci.py) works with the sequence 0, 1, 1, 2, 3, 5, 8… in three ways: a loop that builds a list, a recursive function with a memo, and a check for whether a number belongs to the sequence.

## ▶️ How to run

```bash
python fibonacci.py
```

```
How many Fibonacci numbers? 10
[0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
Number 9 by recursion: 34
Fibonacci number 90: 2880067194370816120
Is 21 a Fibonacci number? yes
Is 22 a Fibonacci number? no
Is 144 a Fibonacci number? yes
```

## 🎯 The challenge

| Function | What it does |
|---|---|
| `fibonacci_list(count)` | Two variables, `a, b = b, a + b`, appended `count` times. |
| `fibonacci_recursive(n, memo)` | `f(n) = f(n-1) + f(n-2)`, saving each answer in `memo` so it is computed once. |
| `is_fibonacci(number)` | Walks up the sequence until it reaches or passes the number. |

## 🧠 What I learned

- `a, b = b, a + b` swaps both values at once, so no temporary variable is needed
- Plain recursion repeats the same calls again and again; with the memo, number 90 comes back instantly
- A default of `memo=None` and then `memo = {}` inside avoids sharing one dictionary between calls by accident
- Python integers have no size limit, so the 19-digit answer for 90 just works

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 1 Remote Learning - Python - Remote Exercise
