# ⏱️ Timed Challenge 1 - Reverse the Sentence

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/timed-challenge1-761d03d053.svg" width="100%" alt="Progress card for Timed Challenge1">

</div>

A small program in [timedsentence.py](timedsentence.py) that reverses the order of the words in a sentence.

## ▶️ How to run

```bash
python timedsentence.py
```

Type a line and press Enter:

```
You have entered a wrong domain
domain wrong a entered have You
```

## 🎯 The challenge

`reverse_words(line)` does it in three steps:

1. `line.split()` breaks the sentence into words on any whitespace.
2. `words.reverse()` flips the list in place.
3. `" ".join(words)` glues the words back with single spaces.

If there is no input at all (`EOFError`), the program prints an empty line.

## 🧠 What I learned

- `split()` with no argument also handles several spaces in a row
- `list.reverse()` changes the list and returns `None`, so I call it on its own line
- `" ".join()` is the opposite of `split()`

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 1 Day 3 - Dictionaries - Timed Challenge 1
