# 💪 Daily Challenge - Play With Words

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/play-with-words-ccce75e27c.svg" width="100%" alt="Progress card for Play With Words">

</div>

Two promise challenges on one page: upper-case and sort a list of words, then translate text to Morse code with a chain of promises.

## ▶️ How to run

Open `index_daily_challenges.html` in a browser. The script uses `document` and `prompt`, so it does not run with Node.

Example 3 resolves with:

```
["APPLE","BANANA","KIWI","MELON","PEAR"]
```

## 🎯 The challenge

| Function | What it does |
|---|---|
| `makeAllCaps(arr)` | Resolves with every word in capitals, or rejects if an item is not a string |
| `sortWords(arr)` | Resolves with a sorted copy if there are more than 4 words, otherwise rejects |
| `toJs()` | Parses the `morse` JSON string into an object |
| `toMorse(morseJS)` | Reads the text box (or asks with `prompt`) and resolves with the Morse code of each character, or rejects on an unknown one |
| `joinWords(morseArr)` | Joins the codes and writes them on the page |

Example 1 rejects (a number in the list), example 2 rejects (only 3 words), example 3 resolves.

Known bugs in the Morse part: a `//` comment inside the `morse` string makes `JSON.parse` fail, so **Translate** shows `Invalid Morse JSON.`, and `joinWords` joins with the text `\n` instead of a line break.

## 🧠 What I learned

- Returning a promise from `.then()` lets me chain the next step
- One `.catch()` at the end handles a rejection from any step
- JSON does not allow comments, even inside a JavaScript template string

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 4 Day 4 - Asynchronous JavaScript - Daily Challenge
