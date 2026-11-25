# 🥷 Exercises XP Ninja

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xp-ninja-03304cc28f.svg" width="100%" alt="Progress card for Exercises XP Ninja">

</div>

Four Node scripts that go past the basics: streams with `readline`, a recursive folder tree, a logger module and a countdown timer.

## ▶️ How to run

```bash
node word-count.js sample.txt
node tree.js .
node use-logger.js
node countdown.js 3
```

```
sample.txt: 5 lines, 70 words
Most used words:
  file     5
  lines    2
  piece    2
  reads    2
  stream   2
```

## 🎯 The challenge

| File | What it does |
|---|---|
| [word-count.js](word-count.js) | Reads [sample.txt](sample.txt) line by line with `createReadStream` + `readline` and `for await`, counts lines and words, and lists the top 5 words (skipping words like "the" and "a") |
| [tree.js](tree.js) | Prints a folder as a tree with `├──` and `└──`, folders first, going into sub-folders with recursion and skipping `node_modules` and `.git` |
| [logger.js](logger.js) + [use-logger.js](use-logger.js) | `createLogger(name, minLevel)` returns `debug`/`info`/`warn`/`error` functions that add a time and skip messages under the chosen level |
| [countdown.js](countdown.js) | `setInterval` once a second, `clearInterval` at zero, and a `SIGINT` handler so Ctrl+C prints how many seconds were left |

## 🧠 What I learned

- A stream reads the file in pieces, so the same code would work on a file much bigger than memory
- `withFileTypes: true` gives `isDirectory()` without a second call to `stat()`
- The logger is a closure: each logger keeps its own `lines` array and level
- Forgetting `clearInterval` would keep the process alive forever, since an active timer stops Node from exiting

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 6 Day 4 - Introduction to Node.js - Exercises XP Ninja
