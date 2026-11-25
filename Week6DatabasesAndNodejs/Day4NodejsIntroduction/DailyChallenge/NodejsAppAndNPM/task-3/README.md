# 🧪 Task 3 - Advanced File Operations

<div align="center">

<img src="../../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../../assets/readme/progress/task-3-a8f915097a.svg" width="100%" alt="Progress card for Task 3">

</div>

In the third task the shared [`read-file.js`](../read-file.js) module reads [`files/file-data.txt`](../files/file-data.txt) and prints it.

## ▶️ How to run

```bash
node app.js
```

```
🧪 Task 3 — Advanced File Operations
📄 File content:
This is a tiny data file for the daily challenge.
It demonstrates reading with Node's fs module. ✅

✅ Done.
```

## 🎯 The challenge

- `readAndPrint(relativePath = "./files/file-data.txt")` turns the path into a full one with `path.resolve(__dirname, relativePath)`, reads it with `fs.promises.readFile` and prints the text.
- When the file is missing it logs `❌ Failed to read: …` and throws again, and the `.catch()` in `app.js` exits with code 1.

## 🧠 What I learned

- With `fs.promises` I can `await` the read instead of passing a callback
- The default parameter means `app.js` can call `readAndPrint()` with nothing
- `__dirname` points at the folder of `read-file.js`, so the path works even when I run the script from inside `task-3/`

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 6 Day 4 - Introduction to Node.js - Task 3
