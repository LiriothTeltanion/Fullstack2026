# 💪 Daily Challenge - Creating Objects

<div align="center">

<img src="../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../assets/readme/progress/daily-challenge-615fbaa15b.svg" width="100%" alt="Progress card for Daily Challenge">

</div>

A `Video` class with a title, an uploader and a length in seconds, plus a `watch()` method. I make two videos by hand and five more from an array.

## ▶️ How to run

From this folder:

```bash
npx tsc VideoObjects.ts --module commonjs --outDir ~/tmp-ts
node ~/tmp-ts/VideoObjects.js
```

The demo block only runs as CommonJS (`require.main === module`), and inside this repository `.js` files are ES modules, so I compile it to a folder outside the repo first.

```
Kevin watched all 420 seconds of Intro to TypeScript!
Lirioth watched all 900 seconds of Advanced Array Methods!
Ada watched all 300 seconds of JS Basics!
...
Alex watched all 360 seconds of Testing 101!
```

## 🎯 The challenge

1. **`class Video`** — the constructor takes `title`, `uploader` and `time`.
2. **`watch()`** — returns `"<uploader> watched all <time> seconds of <title>!"`.
3. **Two instances** — `video1` and `video2`.
4. **Bonus** — `videosData` is an array of five plain objects, and `map` turns each one into a `Video`.

## 🧠 What I learned

- A class bundles data and the methods that use it
- An array of objects with named fields is easy to read and to loop over
- `map` with `new` creates many instances in one line

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 4 Day 2 - Advanced Object Methods - Daily Challenge
