# 💪 Daily Challenge — Lists & Strings

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/list-and-strings-c081f54eec.svg" width="100%" alt="Progress card for List And Strings">

</div>

Two small problems in [dailychallengelistandstrings.py](dailychallengelistandstrings.py): generating multiples and cleaning repeated letters. The interactive part sits in a `_cli()` function, so I can import the helpers without triggering any prompts.

## 1️⃣ Multiples of a number

Reads a number and a length, then prints the first `length` multiples.

```
Enter a number: 7
Enter length: 5
[7, 14, 21, 28, 35]
```

```python
def multiples(number: int, length: int) -> List[int]:
    if length < 0:
        raise ValueError("length must be non-negative")
    return [number * i for i in range(1, length + 1)]
```

Negative numbers work (`multiples(-3, 4)` gives `[-3, -6, -9, -12]`), a length of 0 gives `[]`, and a negative length raises `ValueError`.

## 2️⃣ Remove consecutive duplicate letters

Reads a word and collapses letters that repeat next to each other.

```
Enter a word: ppoollee
pole
```

`collapse_duplicates("bookkeeper")` gives `"bokeper"`. It is case-sensitive, so `"AaAa"` stays the same, and repeats that are not next to each other stay too (`"abca"`).

## ▶️ Run

```bash
python dailychallengelistandstrings.py
```

The examples in the docstrings also run as doctests:

```bash
python -m doctest -v dailychallengelistandstrings.py
```

## 💡 What I learned

- A list comprehension with `range(1, length + 1)` replaces a whole loop.
- Comparing each character with the last one I kept is enough to drop neighbours that repeat.
- Small pure functions are easy to test with doctests.

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)
