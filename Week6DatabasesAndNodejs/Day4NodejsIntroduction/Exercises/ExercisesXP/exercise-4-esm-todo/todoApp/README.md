# 🧪 Exercise 4 - Todo App

<div align="center">

<img src="../../../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../../../assets/readme/progress/todo-app-fd921d256b.svg" width="100%" alt="Progress card for Todo App">

</div>

A `TodoList` class exported as an ES module, and a script that adds three tasks, completes two of them and prints the list.

## ▶️ How to run

```bash
node app.js
```

```
🧠 Current tasks:
- [✅ done] (1) Review PR #42
- [⏳ pending] (2) Write unit tests
- [✅ done] (3) Water the cactus 🌵
```

## 🎯 The challenge

| Method | What it does |
|---|---|
| `add(text)` | Trims the text, gives it the next id and stores `{ id, text, done: false }`; empty text throws an error |
| `complete(id)` | Marks the task as done, or returns `false` if the id does not exist |
| `list()` | Returns a copy of the tasks array |

The tasks live in memory only, so the list starts empty on every run. `package.json` has `"type": "module"` for the `import` / `export` syntax.

## 🧠 What I learned

- `export class` shares a whole class between modules
- A counter like `_nextId` gives each task a unique id
- Returning `[...this.tasks]` stops other code from changing the original array
- Throwing an error is a clear way to reject bad input

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 6 Day 4 - Introduction to Node.js - Exercise 4
