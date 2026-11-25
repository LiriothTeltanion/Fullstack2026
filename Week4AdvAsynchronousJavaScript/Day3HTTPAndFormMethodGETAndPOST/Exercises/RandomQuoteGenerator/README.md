# 🎮 Mini Project - Random Quote Generator

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/random-quote-generator-fdaba25419.svg" width="100%" alt="Progress card for Random Quote Generator">

</div>

A quote app in plain JavaScript: it shows a random quote (never the same one twice in a row), lets me like it, count its characters and words, add new quotes and filter them by author.

## ▶️ How to run

Open `index.html` in a browser, or run `npm run dev` from the repository root and go to `http://localhost:8000/Week4AdvAsynchronousJavaScript/Day3HTTPAndFormMethodGETAndPOST/Exercises/RandomQuoteGenerator/`.

## 🎯 The challenge

| Function | What it does |
|---|---|
| `randomIndex()` | Picks a random index that is different from the last one |
| `render(idx)` | Shows the quote, the author and the like count |
| `countChars(includeSpaces)` | Counts characters with or without spaces |
| `countWords()` | Counts the words of the current quote |
| `showFiltered(pos)` | Moves through the filtered quotes and wraps around at both ends |
| `updateFilterStatus()` | Shows `Filtered by author: ... — 1 of N` and turns Previous/Next on or off |

A new quote gets the next `id` after the highest one. The author filter is case-insensitive and matches part of the name; **Clear** removes it.

## 🧠 What I learned

- A `do...while` loop is handy for "pick again until it is different"
- Keeping indexes in a separate array makes filtering easy without copying the quotes
- `(pos + length) % length` wraps an index around in both directions

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 4 Day 3 - HTTP and GET/POST Forms - Mini Project
