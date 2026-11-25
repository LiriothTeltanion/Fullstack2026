# 🎮 Mini Project - Random Quote Generator

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/random-quote-generator-fdaba25419.svg" width="100%" alt="Progress card for Random Quote Generator">

</div>

My quote app in plain JavaScript. It shows a random quote (never the last one again), and I can like it, count its characters and words, add quotes and step through one author's quotes.

## ▶️ How to run

Open `index.html` in a browser, or run `npm run dev` from the repository root and go to `http://localhost:8000/Week4AdvAsynchronousJavaScript/Day3HTTPAndFormMethodGETAndPOST/Exercises/RandomQuoteGenerator/`.

## 🎯 The challenge

| Function | What it does |
|---|---|
| `randomIndex()` | Draws again in a `do...while` until the index differs from `lastIndex` |
| `render(idx)` | Writes the quote, the author and the like count |
| `countChars(includeSpaces)` | Counts characters with or without whitespace |
| `countWords()` | Splits on whitespace and counts the words |
| `showFiltered(pos)` | Moves through the filtered quotes and wraps at both ends |
| `updateFilterStatus()` | Shows `Filtered by author: ... — 1 of N` and enables Previous/Next |

A new quote gets the highest `id` plus one. The filter is case-insensitive and matches part of a name; **Clear** removes it.

Quote 0 shows on load and `lastIndex` starts at 0 too, so the first **Generate Quote** always brings a different quote.

## 🧠 What I learned

- `do...while` fits "pick again until it is different" because the first pick always happens
- Keeping only the matching indexes in `filtered` avoids copying quote objects
- `(pos + length) % length` wraps an index in both directions, -1 included

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 4 Day 3 - HTTP and GET/POST Forms - Mini Project
