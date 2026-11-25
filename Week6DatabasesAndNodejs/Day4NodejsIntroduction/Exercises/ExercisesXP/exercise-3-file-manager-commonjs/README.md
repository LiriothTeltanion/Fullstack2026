# 🧪 Exercise 3 - File Manager (CommonJS)

<div align="center">

<img src="../../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../../assets/readme/progress/exercise-3-file-manager-commonjs-d81ac35c81.svg" width="100%" alt="Progress card for Exercise 3 file manager commonjs">

</div>

A small CommonJS module with promise-based `readFile` and `writeFile` helpers, used to read one text file and write another.

## ▶️ How to run

Run it inside this folder, because the file paths are resolved from the current directory:

```bash
node app.js
```

```
✅ Read: …/Hello World.txt
💡 Content of 'Hello World.txt': Hello World !!
✅ Wrote: …/Bye World.txt
⚙️  Done.
```

It overwrites `Bye World.txt` (which starts as `Bye World !!`) with `Writing to the file`.

## 🎯 The challenge

| Function | What it does |
|---|---|
| `readFile(filePath)` | Reads a UTF-8 file with `fs.promises`, logs its full path and returns the text |
| `writeFile(filePath, content)` | Creates missing folders with `mkdir({ recursive: true })`, then writes the text |
| `main()` in `app.js` | Reads `Hello World.txt`, prints it and writes `Writing to the file` into `Bye World.txt` |

Both helpers log an error and throw it again, so `app.js` exits with code 1 when something fails.

## 🧠 What I learned

- `require("fs").promises` gives `fs` functions that work with `await`
- `path.resolve()` turns a relative path into a full one, based on where I run the command
- Re-throwing an error lets the caller decide what to do with it
- Writing a file replaces its old content

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 6 Day 4 - Introduction to Node.js - Exercise 3
