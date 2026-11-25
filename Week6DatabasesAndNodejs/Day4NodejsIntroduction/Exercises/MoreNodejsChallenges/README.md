# 🧪 Exercise - More Node.js Challenges

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/more-nodejs-challenges-a4901fe2b4.svg" width="100%" alt="Progress card for More Node.js Challenges">

</div>

A notes app for the terminal. [notes.js](notes.js) reads the command, and [notesStore.js](notesStore.js) loads, changes and saves the notes in a `notes.json` file next to them.

## ▶️ How to run

```bash
node notes.js add "Shopping" "Guitar strings and a capo"
node notes.js add "Course" "Finish the Week 6 SQL challenges"
node notes.js list
node notes.js search guitar
node notes.js read 2
node notes.js remove 1
```

```
Added note #1: Shopping
Added note #2: Course
2 note(s):
#1 Shopping (2026-11-25)
#2 Course (2026-11-25)
1 match(es) for "guitar"
#1 Shopping (2026-11-25)
#2 Course (2026-11-25)
Finish the Week 6 SQL challenges
Removed note #1
```

`notes.json` is in the folder's `.gitignore`, because it holds my own notes, not code.

## 🎯 The challenge

| Command | What happens |
|---|---|
| `add "Title" "Body"` | `addNote()` refuses a title that already exists (ignoring case) and gives the next free id |
| `list` | Every note with its id and date, or "No notes yet." |
| `read <id>` | One note with its body |
| `search <text>` | `searchNotes()` looks in titles and bodies |
| `remove <id>` | `removeNote()` throws when the id doesn't exist |

Unknown commands print the list of commands and exit with code 1.

## 🧠 What I learned

- Splitting the file work (`notesStore.js`) from the command handling (`notes.js`) kept both files short
- `addNote()` and `removeNote()` return a new array instead of changing the old one, so saving is a separate, clear step
- An object of async functions (`commands[command]` called with `...args`) works as a small command router
- Setting `process.exitCode = 1` marks the run as failed without cutting off the output

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 6 Day 4 - Introduction to Node.js - Exercise


## 🧪 Command verification

Run `npm test` or `node --test notes.test.js` from this directory. Each test copies the CLI and its store into a fresh temporary folder before running commands. The suite checks add, list, read, search and remove, case-insensitive duplicate titles, missing IDs and invalid commands.

The command router checks that the command is an own property of its table. Names inherited from Object.prototype, such as `toString`, `constructor` and `__proto__`, receive the same command help and exit code 1 as any other unregistered command.

Node.js 22.13 or newer within the 22.x line, or Node.js 24 and newer, matches the repository's toolchain. The checks exercise file persistence using temporary notes only.
