# 🥇 Exercises XP Gold

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xpgold-1439b84fab.svg" width="100%" alt="Progress card for Exercises XPGold">

</div>

Four small string and array functions, plus a DOM exercise that paints the diagonal of a table red.

## ▶️ How to run

Open `index.html` in a browser (or use `npm run dev` from the repo root) and open DevTools → Console for Exercises 1–4. The table on the page shows Exercise 5.

```
Exercise 1 — isBlank: true false
Exercise 2 — abbrevName: Robin S.
Exercise 3 — swapCase: tHE qUICK bROWN fOX
Exercise 4 — isOmnipresent: true false
```

## 🎯 The challenge

| Function | What it does |
|---|---|
| `isBlank(str)` | `true` when the string is empty. |
| `abbrevName(fullName)` | Keeps the first name and the initial of the second: `Robin S.` |
| `swapCase(s)` | Turns upper case into lower case and the other way round, one character at a time. |
| `isOmnipresent(arrOfArrs, value)` | `true` only when the value is in every sub-array. |
| `colorDiagonalRed()` | Adds the `red` class to `rows[i].cells[i]` of the 5×5 table. |

## 🧠 What I learned

- `split(/\s+/)` handles names with extra spaces
- Comparing a character with its `toUpperCase()` tells me its case
- Returning `false` early stops the search as soon as one sub-array misses the value
- `table.rows` and `row.cells` make table work easy without extra selectors

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 3 Day 2 - Functions and DOM Introduction - Exercises XP Gold
