# 💪 Daily Challenge - Words in the Stars

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/words-in-the-stars-47bf0873fc.svg" width="100%" alt="Progress card for Words In The Stars">

</div>

You give it some words separated by commas and it prints them one per line inside a rectangle of stars. The longest word sets how wide the frame is.

## ▶️ How to run

`index.js` uses `require` and `module.exports`, but the repo root `package.json` has `"type": "module"`, so `node index.js` fails (`window is not defined`). A `.cjs` copy runs fine:

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

Without arguments the script asks for the words through `readline`.

## 🧠 What I learned

- `split(",")`, then `trim()` on each word, then `filter(Boolean)` cleaned up input like `"a, , b"`
- Padding every word with `" ".repeat(maxLen - w.length)` keeps the right border straight
- I have to find the longest word first, because the border depends on it
- `require.main === module` only makes sense when Node loads the file as CommonJS

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 3 Day 2 - Functions and DOM Introduction - Daily Challenge
