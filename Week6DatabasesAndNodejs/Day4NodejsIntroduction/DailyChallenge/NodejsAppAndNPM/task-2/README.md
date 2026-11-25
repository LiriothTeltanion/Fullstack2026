# 🧪 Task 2 - Using an npm Module

<div align="center">

<img src="../../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../../assets/readme/progress/task-2-fdb5b7dbaa.svg" width="100%" alt="Progress card for Task 2">

</div>

The second task prints a colored message with the `chalk` package, through the shared [`colorful-message.js`](../colorful-message.js).

## ▶️ How to run

`chalk` gets installed in the parent folder:

```bash
cd ..
npm install
node task-2/app.js
```

```
🧪 Task 2 — Using an NPM Module
 Daily Challenge  Running Task 2 ✅
💡 Tip: Try editing the message styles for fun!
```

In a terminal, ` Daily Challenge ` shows bold white on blue, `Running Task 2` is green and the "Tip" label is yellow. The block above is plain because Markdown has no colors.

## 🎯 The challenge

- `package.json` pins `chalk` to `^4.1.2`. Version 5 and later only work with `import`, and this project uses `require()`.
- `showColorfulMessage()` builds each line from chained styles, for example `chalk.bgBlue.white.bold(" Daily Challenge ")`.

## 🧠 What I learned

- Node looks for `node_modules` in parent folders too, so `task-2/app.js` finds the `chalk` installed one level up
- Each `.` in `chalk.bgBlue.white.bold` adds one more style
- Picking the package version matters: the newest `chalk` would have broken my `require` call

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 6 Day 4 - Introduction to Node.js - Task 2
