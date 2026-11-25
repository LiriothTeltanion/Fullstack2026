# 💪 Daily Challenge - True or False

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/true-or-false-1764d91f98.svg" width="100%" alt="Progress card for True Or False">

</div>

A function that returns `true` only when every argument is truthy, with a demo page to try it.

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
| `allTruthy(...values)` | Loops over the arguments and returns `false` at the first falsy one, otherwise `true` |
| `parseToken(token)` | Turns typed text like `true`, `null`, `""` or `42` into the real value |

Three buttons run the examples above. The custom box splits my input on commas, parses each part and prints the values and the result as JSON.

## 🧠 What I learned

- Rest parameters (`...values`) collect any number of arguments
- The falsy values are `false`, `0`, `""`, `null`, `undefined` and `NaN`
- `values.every(Boolean)` is the one-line version

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 4 Day 3 - HTTP and GET/POST Forms - Daily Challenge
