# 🥇 Exercises XP Gold

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xpgold-1439b84fab.svg" width="100%" alt="Progress card for Exercises XPGold">

</div>

Four little functions for strings and arrays, and one DOM task that paints the diagonal of a table red.

## ▶️ How to run

Open `index.html` in a browser (or use `npm run dev` from the repo root). Exercises 1–4 print in DevTools → Console, and Exercise 5 is the table on the page.

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

`colorDiagonalRed()` is wrapped in `( … )()`, so it runs once by itself when the script loads.

## 🧠 What I learned

- Splitting the name with `/\s+/` means double spaces don't break `abbrevName`
- If a character equals its own `toUpperCase()`, it was already upper case, so I flip it down
- In `isOmnipresent` I `return false` at the first sub-array without the value, no need to check the rest
- The diagonal is just "row number = cell number", and `table.rows[i].cells[i]` reads exactly like that

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 3 Day 2 - Functions and DOM Introduction - Exercises XP Gold
