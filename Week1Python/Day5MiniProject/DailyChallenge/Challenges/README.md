# 📝 Daily Challenge - String Sorting & Analysis

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/challenges-48c4324ce8.svg" width="100%" alt="Progress card for Challenges">

</div>

Two string challenges from the Week 1 Day 5 daily challenge, both in `challenges.py`: sort comma-separated words alphabetically, and find the longest word in a sentence.

## How to run

```bash
python challenges.py
```

It asks for comma-separated words and prints them sorted. After that, a few `assert` checks for the longest-word function run automatically. If nothing else is printed, they all passed.

```
Enter comma-separated words: banana,apple,cherry,date
apple,banana,cherry,date
```

## Challenge 1: Sorting

I split on commas, strip the spaces around each word and drop empty entries, so `"  apple  ,  banana  "` works and an empty input prints a "No valid words" message.

```python
def sort_comma_separated(words: str) -> List[str]:
    cleaned = [part.strip() for part in words.split(",") if part.strip()]
    return sorted(cleaned)
```

## Challenge 2: Longest word

The rules:

1. Return the word as it appears in the sentence, punctuation included (`Margaret's`, `forever.`).
2. Count only letters, so `Wow!!!` has 3 letters, not 6.
3. On a tie, keep the first word.
4. If there are no letters at all, return an empty string.

```python
def longest_word(sentence: str) -> str:
    words = sentence.split()
    best = ""
    longest_length = 0
    for w in words:
        cleaned = re.sub(r"[^A-Za-z]", "", w)
        if not cleaned:
            continue
        if len(cleaned) > longest_length:
            best = w
            longest_length = len(cleaned)
    return best
```

| Sentence | Result |
|----------|--------|
| `Margaret's toy is a pretty doll.` | `Margaret's` |
| `A thing of beauty is a joy forever.` | `forever.` |
| `Forgetfulness is by all means powerless!` | `Forgetfulness` |
| `!!! 123 ...` | `""` |

## What I learned

- Parsing input with `split()`, `strip()` and a list comprehension
- Using `re.sub()` to count only the letters while keeping the original word
- Tracking the best candidate in one loop, and checking edge cases with `assert`

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 1 Day 5 - Daily Challenge
