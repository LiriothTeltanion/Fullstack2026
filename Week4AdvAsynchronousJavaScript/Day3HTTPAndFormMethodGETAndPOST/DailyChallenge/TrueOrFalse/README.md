# 💪 Daily Challenge - True or False

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/true-or-false-1764d91f98.svg" width="100%" alt="Progress card for True Or False">

</div>

`allTruthy()` answers `true` only if every argument it gets is truthy. The page has three fixed tests and a box for my own values.

## ▶️ How to run

Open `index.html` in a browser (no build step), or run `npm run dev` from the repository root and go to `http://localhost:8000/Week4AdvAsynchronousJavaScript/Day3HTTPAndFormMethodGETAndPOST/DailyChallenge/TrueOrFalse/`.

```
allTruthy(true, true, true) → true
allTruthy(true, false, true) → false
allTruthy(5, 4, 3, 2, 1, 0) → false
```

## 🎯 The challenge

| Function | What it does |
|---|---|
| `allTruthy(...values)` | A `for...of` loop that returns `false` at the first falsy value, otherwise `true` |
| `parseToken(token)` | Turns typed text like `true`, `null`, `""` or `42` into the real value |

The custom box splits the input on commas, parses each part and prints `{ values, result }` as JSON. One quirk: an empty part (like the end of `1, 2,`) becomes `0`, because `Number("")` is 0.

## 🧠 What I learned

- A rest parameter (`...values`) gathers every argument into a real array
- JavaScript has six falsy values: `false`, `0`, `""`, `null`, `undefined` and `NaN`
- `values.every(Boolean)` does the same job as my loop in one line

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 4 Day 3 - HTTP and GET/POST Forms - Daily Challenge
