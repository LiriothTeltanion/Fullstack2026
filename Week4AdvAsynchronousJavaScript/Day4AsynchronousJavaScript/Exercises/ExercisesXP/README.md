# 🥉 Exercises XP

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xp-44a220fa48.svg" width="100%" alt="Progress card for Exercises XP">

</div>

Three promise exercises with a small page: one button per exercise, results in the page and in the console.

## ▶️ How to run

Open `index_promises.html` in a browser, open DevTools → Console and click the buttons. The script uses `document`, so it does not run with Node.

```
Error: 15 is greater than 10
OK: 8 <= 10
```

## 🎯 The challenge

1. **`compareToTen(num)`** — resolves with `OK: num <= 10` or rejects with `Error: num is greater than 10`. The button tries 15 (reject) and 8 (resolve).
2. **`delayedSuccess`** — a promise that resolves with `"success"` after 4 seconds.
3. **`pResolved` / `pRejected`** — `Promise.resolve(3)` and `Promise.reject("Boo!")`, logged with `.then()` and `.catch()`.

## 🧠 What I learned

- A promise starts running as soon as it is created, not when I call `.then()`
- `.catch()` handles a rejection anywhere before it in the chain
- `Promise.resolve` and `Promise.reject` make already-settled promises

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 4 Day 4 - Asynchronous JavaScript - Exercises XP
