# 💪 Daily Challenge - Play With Words

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/play-with-words-ccce75e27c.svg" width="100%" alt="Progress card for Play With Words">

</div>

Two promise chains in `daily_promises_morse.js`: one upper-cases and sorts a list of words, the other is meant to turn text into Morse code.

## ▶️ How to run

Open `index_daily_challenges.html` in a browser. The script needs `document` and `prompt`, so Node can't run it.

The third test button resolves with:

```
["APPLE","BANANA","KIWI","MELON","PEAR"]
```

## 🎯 The challenge

| Function | What it does |
|---|---|
| `makeAllCaps(arr)` | Resolves with every word in capitals, or rejects if an item is not a string |
| `sortWords(arr)` | Resolves with a sorted copy when there are more than 4 words, otherwise rejects |
| `toJs()` | Parses the `morse` JSON string into an object |
| `toMorse(morseJS)` | Reads the text box (or asks with `prompt`) and resolves with one code per character, or rejects on an unknown one |
| `joinWords(morseArr)` | Joins the codes and writes them into `#morseOut` |

Test 1 rejects (a number in the list), test 2 rejects (only three words), test 3 resolves.

The Morse part is still broken. The `morse` string ends with a `//` comment, which JSON does not allow, so **Translate** always shows `Invalid Morse JSON.`. After that, `joinWords` would join with the text `\n` instead of a real line break.

## 🧠 What I learned

- When a `.then()` returns a promise, the next `.then()` waits for it
- One `.catch()` at the end catches a rejection from any step of the chain
- `JSON.parse` is strict: a single comment makes the whole parse fail

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 4 Day 4 - Asynchronous JavaScript - Daily Challenge
