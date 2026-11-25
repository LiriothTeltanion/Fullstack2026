# 🧪 Exercise 1 - Todo List

<div align="center">

<img src="../../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../../assets/readme/progress/exercise1-todo-6cbda756ce.svg" width="100%" alt="Progress card for Exercise1 todo">

</div>

Another to-do app, but this one has All / Active / Completed filters and keeps the list in `localStorage`, so it's still there after a reload.

## ▶️ How to run

Open `index.html` in a browser (or run `npm run dev` from the repo root and open this folder at `http://localhost:8000/`). `js/app.js` uses `document` and `localStorage`, so it only runs in the browser, not with `node`.

## 🎯 The challenge

| Function | What it does |
|---|---|
| `addTodo()` | Adds the trimmed text as `{ id, text, done: false }` (button or Enter); empty text is ignored. |
| `toggle(id)` | Flips `done` when the checkbox is clicked. |
| `removeOne(id)` / `removeAll()` | Remove one task, or all of them with **Remove All**. |
| `render()` | Redraws the list for the current filter (All, Active, Completed), updates the `N items` counter and disables **Remove All** when the list is empty. |
| `save()` | Writes the list to `localStorage` under `todos_v1`. |

Every change goes the same way: update the `todos` array, call `save()`, call `render()`.

## 🧠 What I learned

- `localStorage` holds only strings, so the array goes in with `JSON.stringify` and comes back with `JSON.parse`
- The `|| "[]"` on the first load means an empty storage gives me an empty list instead of an error
- A single click listener on `#list` handles every checkbox and every Remove button
- The task text goes in with `textContent`, never inside the `innerHTML` template, so typed HTML stays plain text

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 3 Remote Learning - JavaScript and the DOM - Exercise 1
