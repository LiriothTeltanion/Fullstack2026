# 💪 Daily Challenge - Not Bad

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/daily-challenge-not-bad-d1c834c9ea.svg" width="100%" alt="Progress card for Daily Challenge Not Bad">

</div>

A small page that asks for a sentence and replaces the part from `not` to `bad` with `good`, but only when `bad` comes after `not`.

## ▶️ How to run

Open `index.html` in a browser (or run `npm run dev` from the repo root and open this folder at `http://localhost:8000/`), then click **Run**.

```
Input:  The movie is not that bad, I like it
Result: The movie is good, I like it
```

## 🎯 The challenge

`checkSentence()` in `script.js`:

1. Asks for a sentence with `prompt()` (an empty answer or Cancel shows `No sentence.`).
2. Finds `wordNot = sentence.indexOf("not")` and `wordBad = sentence.indexOf("bad")`.
3. If both exist and `wordBad > wordNot`, it builds `before + "good" + after` with `slice()` (`after` starts at `wordBad + 3`).
4. Otherwise it keeps the sentence as it is.
5. Shows the result in `#result` and logs the indexes in the console.

| Input | Result |
|---|---|
| `This dinner is not that bad ! You cook well` | `This dinner is good ! You cook well` |
| `This dinner is bad !` | `This dinner is bad !` (no `not`) |

More notes and edge cases are in [README_Not_Bad_JS.md](README_Not_Bad_JS.md).

## 🧠 What I learned

- `indexOf()` returns `-1` when a word is missing, so I check both indexes first
- `slice()` lets me rebuild a string around the part I want to replace
- The search is case-sensitive: `Not` or `BAD` are not found
- `prompt()` returns `null` on Cancel, so I handle that before using the text

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 3 Day 1 - Introduction to JavaScript - Daily Challenge
