# 🧪 Exercise 3 - File Manager (CommonJS)

<div align="center">

<img src="../../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../../assets/readme/progress/exercise-3-file-manager-commonjs-d81ac35c81.svg" width="100%" alt="Progress card for Exercise 3 file manager commonjs">

</div>

`fileManager.js` is a little CommonJS module with promise-based `readFile` and `writeFile`. `app.js` uses it to read one text file and write another.

## ▶️ How to run

Run it from inside this folder. The paths are resolved from the current directory, not from the script:

```bash
node app.js
```

```
✅ Read: …/Hello World.txt
💡 Content of 'Hello World.txt': Hello World !!
✅ Wrote: …/output/Bye World.txt
⚙️  Done.
```

The script writes into `output/Bye World.txt`, which `writeFile` creates on the first run. The `output/` folder is git-ignored, so the `Bye World.txt` next to `app.js` keeps its `Bye World !!` and running the demo doesn't change any tracked file.

## 🎯 The challenge

| Function | What it does |
|---|---|
| `readFile(filePath)` | Reads a UTF-8 file with `fs.promises`, logs the full path and returns the text |
| `writeFile(filePath, content)` | Makes any missing folders with `mkdir({ recursive: true })`, then writes the text |
| `main()` in `app.js` | Reads `Hello World.txt`, prints it trimmed and writes `Writing to the file` into `output/Bye World.txt` |

Both helpers log the error and throw it again, and `main().catch()` turns that into exit code 1.

## 🧠 What I learned

- `require("fs").promises` gives the same `fs` functions, but they return promises I can `await`
- `path.resolve("./Hello World.txt")` depends on where I run `node`, which is why the folder matters
- Logging and then re-throwing lets the helper explain the problem while `app.js` decides to stop
- `writeFile` replaces the whole file; it doesn't add to the end
- Writing generated files into an ignored folder keeps `git status` clean after a demo run

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 6 Day 4 - Introduction to Node.js - Exercise 3
