# 🧪 Exercise 7 - File Explorer

<div align="center">

<img src="../../../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../../../assets/readme/progress/file-explorer-e9539c8176.svg" width="100%" alt="Progress card for File explorer">

</div>

Two short scripts with `fs`: the first copies a text file, the second lists what is in its own folder.

## ▶️ How to run

```bash
node copy-file.js
node read-directory.js
```

```
✅ Copied content from source.txt to destination.txt
🧠 Files in file-explorer:
- copy-file.js
- destination.txt
- package.json
- read-directory.js
- README.md
- source.txt
```

`destination.txt` isn't in the repository. The first `copy-file.js` run creates it, which is why it shows up in the list afterwards. It is git-ignored (in the `.gitignore` of `ExercisesXP/`), so the copy never shows up as a change.

## 🎯 The challenge

| Script | What it does |
|---|---|
| `copy-file.js` | Reads `source.txt` and writes the same text into `destination.txt` in the same folder |
| `read-directory.js` | Prints every entry of its own folder, from `fs.readdir` |

Both build their paths from `__dirname`, so I can run them from any folder. If something fails they print the error and call `process.exit(1)`.

## 🧠 What I learned

- `__dirname` is where the script lives, not where I typed `node`
- "Copying" here is just `readFile` followed by `writeFile`, and `writeFile` creates the target if it's missing
- `fs.readdir` gives back plain names, files and folders mixed, and the order can differ between systems
- `path.basename()` let me print `source.txt` instead of the whole long path

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 6 Day 4 - Introduction to Node.js - Exercise 7
