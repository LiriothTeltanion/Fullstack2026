# 🥷 Exercises XP Ninja

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xp-ninja-5a8ffe5199.svg" width="100%" alt="Progress card for Exercises XP Ninja">

</div>

Sticky notes that can be undone and redone. I used it to try the parts of Redux that sit around the reducers: middleware, a reducer that wraps another reducer, and saving the state.

## ▶️ How to run

```bash
npm install
npm run dev
```

Keep the browser console open: every action is printed in a group with the state before and after.

## 🎯 The challenge

1. **Logger middleware.** `logger.js` follows the `store => next => action` shape, logs the state around `next(action)` and is added with `getDefaultMiddleware().concat(logger)`.
2. **Undo and redo.** `undoable(reducer)` returns a new reducer that keeps `past`, `present` and `future`. `history/undo` and `history/redo` move the present between the two lists.
3. **Saving the notes.** `store.subscribe` writes `notes.present` to `localStorage`, and `preloadedState` reads it back when the page opens.

## 🧠 What I learned

- A middleware is three nested functions, and forgetting to call `next(action)` stops the action from ever reaching a reducer
- Wrapping `notesReducer` with `undoable` gave undo to the notes without changing a single line of the notes reducer
- Checking `newPresent === present` keeps actions that change nothing out of the undo history
- `localStorage` can throw (full or blocked), so both helpers sit in `try / catch`

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 9 Day 2 - Redux Overview and Concepts - Exercises XP Ninja
