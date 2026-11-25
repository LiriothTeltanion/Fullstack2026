# 💪 Daily Challenge - Groceries

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/groceries-a9b8627c73.svg" width="100%" alt="Progress card for Groceries">

</div>

Show the difference between copying a value (a string) and sharing a reference (an object), using a `client` name and a `groceries` object.

## ▶️ How to run

Open `index.html` in a browser (or run `npm run dev` from the repo root and open this folder at `http://localhost:8000/`), open DevTools → Console and click **displayGroceries()**, **cloneGroceries()** or **runAll**.

```
Before change -> client: John | user: John
After change  -> client: Betty | user: John
After changes  -> groceries.totalPrice: 35$ | groceries.other.paid: false
```

## 🎯 The challenge

| Function | What it does |
|---|---|
| `displayGroceries()` | Arrow function that logs each fruit with `forEach`. |
| `cloneGroceries()` | Copies `client` into `user`, then changes `client` to `Betty`: `user` stays `John`. Points `shopping` at `groceries`, changes `totalPrice` and `other.paid` through `shopping`, and the change shows in `groceries` too. |

Bonus: a `structuredClone(groceries)` copy is changed on its own and the original stays the same.

More notes are in [README_Groceries.md](README_Groceries.md).

## 🧠 What I learned

- Strings, numbers and booleans are copied by value
- Objects and arrays are shared by reference, so a change through one name shows in the other
- `structuredClone` makes a deep, independent copy, nested objects included
- Arrow functions are a short way to write small helpers

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 3 Day 4 - Advanced JavaScript Functions - Daily Challenge
