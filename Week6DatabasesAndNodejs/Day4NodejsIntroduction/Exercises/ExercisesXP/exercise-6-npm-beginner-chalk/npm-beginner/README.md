# 🧪 Exercise 6 - npm Beginner

<div align="center">

<img src="../../../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../../../assets/readme/progress/npm-beginner-08778c1dcc.svg" width="100%" alt="Progress card for Npm beginner">

</div>

A first npm package in use: `chalk` prints three styled lines in the terminal.

## ▶️ How to run

```bash
npm install
node app.js
```

```
Welcome to the  NPM Beginner  demo!
✅ Success: You just printed a colorful message.
💡 Tip: Try different chalk styles like underline, italic, or inverse.
```

In a real terminal the lines have bold text, a blue background, green and yellow labels, and underline, italic and inverse words.

## 🎯 The challenge

- `package.json` asks for `chalk` `^4.1.2`. Version 4 still works with `require()`; version 5 and newer only work as ES modules.
- Styles chain together, like `chalk.bgBlue.white(...)`, and styled pieces are joined with `+`.
- `chalk.reset(...)` goes back to plain text in the middle of a line.

## 🧠 What I learned

- `npm install` downloads the packages listed in `package.json` into `node_modules`
- The major version matters when a package moves from CommonJS to ES modules
- Chained styles like `bgBlue.white` set the background and the text color at once

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 6 Day 4 - Introduction to Node.js - Exercise 6
