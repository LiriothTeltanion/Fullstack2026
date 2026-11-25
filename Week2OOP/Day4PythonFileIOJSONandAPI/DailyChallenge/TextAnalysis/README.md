# 💪 Daily Challenge - Text Analysis

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/text-analysis-721b11fc6e.svg" width="100%" alt="Progress card for Text Analysis">

</div>

`dailychallengetextanalysis.py` has two classes. `Text` answers questions about a piece of text, and its subclass `TextModification` cleans the text up.

## ▶️ How to run

```bash
python dailychallengetextanalysis.py
```

```text
=== Demo: Text ===
word_frequency('hello') -> 3
most_common_word() -> hello
unique_words() -> ['a', 'again', 'hello', 'is', "isn't", 'it', 'lovely', 'test', 'this', 'tiny']

=== Demo: TextModification ===
remove_punctuation() -> Hello hello This is a tiny test Isnt it lovely Hello again
remove_stop_words() -> hello hello tiny test isn't lovely hello
...
```

The demo makes a fresh `TextModification` before each cleaner, because every cleaner overwrites `self.text`.

## 🎯 The challenge

| Method | What it does |
|---|---|
| `Text.word_frequency(word)` | Counts a word without caring about case, and returns `None` when it's missing |
| `Text.most_common_word()` | `Counter(tokens).most_common(1)` |
| `Text.unique_words()` | Sorted list of the distinct words |
| `Text.from_file(path)` | A class method that reads a file and returns a `Text` |
| `TextModification.remove_punctuation()` | Removes ASCII punctuation with `str.maketrans` and `translate` |
| `TextModification.remove_stop_words()` | Drops words like "the" and "is". You can pass your own list |
| `TextModification.remove_special_characters()` | Regex cleanup. With `keep_basic_punct=True` it keeps `.,!?;:'-` |

Words come from the regex `[A-Za-z0-9']+`, which keeps "isn't" as one word. One side effect: `remove_stop_words()` rebuilds the text from the lowercase tokens, so the capital letters are gone afterwards.

## 🧠 What I learned

- `from_file()` as a `@classmethod` gives `Text` a second way to be created
- `TextModification` reuses the parent's `_tokenize()`, so splitting into words is written only once
- `remove_punctuation()` also removes the apostrophe, so "Isn't" turns into "Isnt"
- Returning `None` instead of `0` from `word_frequency()` tells "not there" apart from a count

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 2 Day 4 - File I/O, JSON and APIs - Daily Challenge
