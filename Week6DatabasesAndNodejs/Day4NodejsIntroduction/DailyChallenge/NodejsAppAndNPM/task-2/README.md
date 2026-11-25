# 🧪 Task 2 - Using an npm Module

<div align="center">

<img src="../../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../../assets/readme/progress/task-2-fdb5b7dbaa.svg" width="100%" alt="Progress card for Task 2">

</div>

Task 2 of the daily challenge: print a colorful message with the `chalk` package, through [`colorful-message.js`](../colorful-message.js).

## ▶️ How to run

`chalk` is installed in the parent folder:

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

In a real terminal ` Daily Challenge ` is bold white on blue, `Running Task 2` is green and the tip label is yellow.

## 🎯 The challenge

- `package.json` asks for `chalk` `^4.1.2`, the last major version that works with `require()`.
- `showColorfulMessage()` builds each line from chained styles like `chalk.bgBlue.white.bold(...)`.

## 🧠 What I learned

- A package installed in a parent folder is found by the modules inside it
- Chained `chalk` styles combine background, color and weight
- Keeping the styling in its own module lets several scripts reuse it

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 6 Day 4 - Introduction to Node.js - Task 2
