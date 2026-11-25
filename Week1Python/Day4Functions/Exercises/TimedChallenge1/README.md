# ⏱️ Timed Challenge 1 - Count Character Occurrence

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/timed-challenge1-11eb650428.svg" width="100%" alt="Progress card for Timed Challenge1">

</div>

A short script in [countoccurence.py](countoccurence.py) that counts how many times a character appears in a string. The count is case-sensitive.

## ▶️ How to run

```bash
python countoccurence.py
```

Line 1 is the string, line 2 is the character to count:

```
Programming is cool!
o
3
```

`This is a great example` with `y` prints `0`, and `Hello World` with `l` prints `3`.

## 🎯 The challenge

```python
def count_char(s: str, ch: str) -> int:
    target = ch[0] if ch else ''
    return sum(1 for c in s if c == target) if target else 0
```

- Case-sensitive: `'A'` is not `'a'`
- If more than one character is typed, only the first one is used
- An empty character gives `0`, and `main()` catches `EOFError` when there is no input

`s.count(ch[0])` would give the same result in one call.

## 🧠 What I learned

- `sum()` over a generator is a short way to count matches
- Checking `ch` before reading `ch[0]` avoids an `IndexError`
- Under time pressure, getting a simple working version first is the right order

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 1 Day 4 - Functions - Timed Challenge 1
