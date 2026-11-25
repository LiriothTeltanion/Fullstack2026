# 💪 Daily Challenge - Node.js App and NPM

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/nodejs-app-and-npm-55f394adf0.svg" width="100%" alt="Progress card for Nodejs App And NPM">

</div>

A small Node.js project in three steps: a CommonJS module, an npm package (`chalk`) and reading a file with `fs`. A last script, `challenge.js`, uses all three together.

## ▶️ How to run

From this folder (`chalk` is needed for task 2 and for `challenge.js`):

```bash
npm install
node task-1/app.js
node task-2/app.js
node task-3/app.js
node challenge.js
```

```
🚀 Challenge — Integration Demo
Hello, Developer! 👋
 Daily Challenge  Running Task 2 ✅
💡 Tip: Try editing the message styles for fun!
📄 File content:
This is a tiny data file for the daily challenge.
It demonstrates reading with Node's fs module. ✅

✅ Done.
🎉 Challenge complete.
```

## 🎯 The challenge

| Module | What it does |
|---|---|
| `greeting.js` | `greet(name)` returns `Hello, <name>! 👋`, or `Hello, friend! 👋` for an empty name |
| `colorful-message.js` | `showColorfulMessage()` prints a title on a blue background and a yellow tip with `chalk` |
| `read-file.js` | `readAndPrint(relativePath)` reads `files/file-data.txt` (the default) with `fs.promises` and prints it |
| `challenge.js` | Calls the three modules in order inside an `async` function |

Each task has its own folder: [`task-1/`](task-1/) (greeting), [`task-2/`](task-2/) (`chalk`) and [`task-3/`](task-3/) (file reading). [`files/`](files/) holds the text file.

## 🧠 What I learned

- One module per job keeps every file short and reusable
- `require("../greeting")` reaches a module one folder up
- `path.resolve(__dirname, ...)` finds the data file wherever I start the script
- An `async` function with `.catch()` turns a failed read into exit code 1

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 6 Day 4 - Introduction to Node.js - Daily Challenge
