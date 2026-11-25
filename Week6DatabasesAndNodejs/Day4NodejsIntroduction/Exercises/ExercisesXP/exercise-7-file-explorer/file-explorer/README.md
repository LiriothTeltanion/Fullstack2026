# 🧪 Exercise 7 - File Explorer

<div align="center">

<img src="../../../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../../../assets/readme/progress/file-explorer-e9539c8176.svg" width="100%" alt="Progress card for File explorer">

</div>

Two small `fs` scripts: one copies a text file, the other lists the files in its own folder.

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

## 🎯 The challenge

| Script | What it does |
|---|---|
| `copy-file.js` | Reads `source.txt` and writes the same text to `destination.txt` next to it, creating it if needed |
| `read-directory.js` | Lists every entry in its own folder with `fs.readdir` |

Both build their paths from `__dirname`, so they work from any current folder, and both exit with code 1 on an error.

## 🧠 What I learned

- `__dirname` is the folder of the script itself, not the folder where I typed the command
- `fs.writeFile` creates the file when it does not exist yet
- `fs.readdir` returns only the names, and the order depends on the system
- `path.basename` keeps just the file name from a full path

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 6 Day 4 - Introduction to Node.js - Exercise 7
