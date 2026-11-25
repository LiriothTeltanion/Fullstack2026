# 💪 Daily Challenge - String Sorting and Longest Word

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/challenges-48c4324ce8.svg" width="100%" alt="Progress card for Challenges">

</div>

Two string challenges in [challenges.py](challenges.py): sort comma-separated words alphabetically, and find the longest word in a sentence.

## ▶️ How to run

```bash
python challenges.py
```

It asks for comma-separated words and prints them sorted. After that, a few `assert` checks for the longest-word function run automatically. If nothing else is printed, they all passed.

```
Enter comma-separated words: banana,apple,cherry,date
apple,banana,cherry,date
```

## 🎯 The challenge

| Function | What it does |
|---|---|
| `sort_comma_separated(words)` | Splits on commas, strips the spaces around each word and drops empty entries, so `"  apple  ,  banana  "` works. An empty input prints a "No valid words" message. |
| `longest_word(sentence)` | Returns the longest word as it appears in the sentence, punctuation included (`Margaret's`, `forever.`). Only letters count, so `Wow!!!` has 3 letters, not 6. On a tie the first word wins, and a sentence with no letters gives an empty string. |

```python
for w in words:
    cleaned = re.sub(r"[^A-Za-z]", "", w)
    if not cleaned:
        continue
    if len(cleaned) > longest_length:
        best = w
        longest_length = len(cleaned)
```

| Sentence | Result |
|----------|--------|
| `Margaret's toy is a pretty doll.` | `Margaret's` |
| `A thing of beauty is a joy forever.` | `forever.` |
| `Forgetfulness is by all means powerless!` | `Forgetfulness` |
| `!!! 123 ...` | `""` |

## 🧠 What I learned

- Parsing input with `split()`, `strip()` and a list comprehension
- Using `re.sub()` to count only the letters while keeping the original word
- Tracking the best candidate in one loop, and checking edge cases with `assert`

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 1 Day 5 - Mini-projects - Daily Challenge
