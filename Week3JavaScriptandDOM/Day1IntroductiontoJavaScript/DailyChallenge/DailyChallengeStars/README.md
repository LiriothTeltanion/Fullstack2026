# 💪 Daily Challenge - Stars

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/daily-challenge-stars-45167b388e.svg" width="100%" alt="Progress card for Daily Challenge Stars">

</div>

A triangle of six rows of stars, drawn twice: once with a single loop and once with two nested loops.

## ▶️ How to run

Open `index.html` in a browser (or use `npm run dev` from the repo root) and click **One loop** or **Two nested loops**. The triangle shows up on the page and in the console.

```
*
* *
* * *
* * * *
* * * * *
* * * * * *
```

## 🎯 The challenge

| Function | What it does |
|---|---|
| `oneLoop()` | Keeps one `line` string and adds `"* "` to it on each of the 6 rows. |
| `twoLoops()` | The outer loop counts the rows; the inner loop adds one `"* "` per column up to the row number. |

In both versions each line goes through `.trim()` before I add it, so no row ends with a space. The final text is written into `<pre id="out">`.

More notes are in [README_Stars_Pattern_JS.md](README_Stars_Pattern_JS.md).

## 🧠 What I learned

- When every row is the row before plus one star, a single loop is enough
- Two nested loops are the version that also works for other shapes
- `"* "` leaves a space at the end of each row, and `.trim()` cleans it up
- Setting `textContent` on a `<pre>` keeps my `\n` line breaks visible

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 3 Day 1 - Introduction to JavaScript - Daily Challenge
