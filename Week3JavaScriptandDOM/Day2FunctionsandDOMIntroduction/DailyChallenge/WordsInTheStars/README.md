# 💪 Daily Challenge - Words in the Stars

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/words-in-the-stars-47bf0873fc.svg" width="100%" alt="Progress card for Words In The Stars">

</div>

Ask for words separated by commas and print them one per line inside a rectangle of stars. The frame width depends on the longest word.

## ▶️ How to run

`index.js` uses `require` and `module.exports`, but the repo root `package.json` has `"type": "module"`, so `node index.js` fails (`window is not defined`). Run a `.cjs` copy instead:

```powershell
Copy-Item index.js $env:TEMP\stars.cjs; node $env:TEMP\stars.cjs "Hello, World, in, a, frame"
```

```bash
cp index.js /tmp/stars.cjs
node /tmp/stars.cjs "Hello, World, in, a, frame"   # words as an argument
node /tmp/stars.cjs                                # asks for the words
```

```
*********
* Hello *
* World *
* in    *
* a     *
* frame *
*********
```

## 🎯 The challenge

| Function | What it does |
|---|---|
| `wordsInTheStars(input)` | Takes a comma-separated string or an array, trims the words, drops empty ones, finds the longest word and returns the framed text (`*` border of `maxLen + 4`). |
| `demo(input)` | Prints the frame, or `⚠️ No words were provided.` when there are no words. |

With no arguments the script asks for the words with `readline`.

## 🧠 What I learned

- `split(",")`, `map(trim)` and `filter(Boolean)` turn messy input into a clean array
- `"*".repeat(n)` and padding with spaces line up every row of the frame
- The longest word decides the width, so I measure before I print
- `require.main === module` only works when Node reads the file as CommonJS

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 3 Day 2 - Functions and DOM Introduction - Daily Challenge
