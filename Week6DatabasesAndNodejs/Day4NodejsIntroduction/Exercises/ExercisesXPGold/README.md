# 🥇 Exercises XP Gold

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xp-gold-d591b175be.svg" width="100%" alt="Progress card for Exercises XP Gold">

</div>

The six package and text exercises have a separate terminal entry. The original five native-module examples remain below and can still run directly without installing dependencies.

## Run the six exercises

Use Node 24 or later. From this directory run `npm ci`, then try the following commands.

| Command | Result |
| --- | --- |
| `npm run practice -- file README.md` | Read the filename, extension, size in bytes, creation time and modification time. A missing file returns `exists: false`. |
| `npm run practice -- posts` | Fetch sample posts from JSONPlaceholder with Axios and print each title in response order. This is the only command that makes a network request. |
| `npm run practice -- dates` | Format today's local date and the date five calendar days later with date-fns. |
| `npm run practice -- users 3` | Generate three fictional listener profiles using Faker. Email addresses use the reserved `example.test` domain. |
| `npm run practice -- digits "take0-mix42"` | Extract the digits in order and print `042`, retaining the leading zero. |
| `npm run practice -- name "María Pérez"` | Check the practice rule for a two-part name. Each word starts with a capital in scripts with letter case. |

The file inspection lives in [file-info.js](file-info.js). [practice.js](practice.js) contains the other five operations and [examples.js](examples.js) handles terminal arguments and error messages. The name rule is deliberately specific to this exercise. Real forms need to accommodate a much wider range of personal names.

Run `npm test` for offline coverage of the six operations and the terminal entry. The post tests use a stand-in for the HTTP client so that an external outage cannot hide a regression in title extraction.

## Original native-module exercises

## ▶️ How to run

From this folder (each one also has an npm script in [package.json](package.json)):

```bash
node system-info.js
node path-explorer.js
node events-demo.js
node json-store.js
node calculator.js 12 x 3.5
```

`events-demo.js` prints:

```
Order #1: 2 x coffee beans
  (first order of the day, this message shows once)
Order #2: 50 x paper cups
  -> big order, tell the warehouse about #2
Rejected milk: quantity must be positive
Listeners on 'placed' now: 1
```

## 🎯 The challenge

| File | What it does |
|---|---|
| [system-info.js](system-info.js) | Platform, CPU cores, free and total memory in GB, uptime in hours, Node version and the line ending (`"\r\n"` on my Windows PC) |
| [path-explorer.js](path-explorer.js) | `path.parse()`, `extname()`, `join()` with `..`, and `format()` to swap `.wav` for `.mp3`. Builds `__dirname` from `import.meta.url` |
| [events-demo.js](events-demo.js) | An `OrderSystem` class that extends `EventEmitter` and emits `placed`, `bigOrder` and `rejected` |
| [json-store.js](json-store.js) | Loads, changes and saves a JSON file three times, then deletes it. It writes to the system temp folder, so the repo stays clean |
| [calculator.js](calculator.js) | `node calculator.js 12 x 3.5` prints `12 x 3.5 = 42`; dividing by 0 and unknown operators get a message |

## 🧠 What I learned

- ES modules have no `__dirname`; `fileURLToPath(import.meta.url)` gives it back
- A listener added with `once()` removes itself after the first event, which is why only one listener is left
- `readFile` on a missing file throws with `code === "ENOENT"`, and I use that as "first run, start empty"
- I used `x` for multiply because the shell expands `*` into file names before Node sees it

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 6 Day 4 - Introduction to Node.js - Exercises XP Gold
