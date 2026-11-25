# 🎮 Mini Project - Drum Set

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/drumset-mini-613bae1cac.svg" width="100%" alt="Progress card for Drumset mini">

</div>

A drum kit in the browser. There are nine pads, and each one plays its sound when I press its key or click it.

## ▶️ How to run

Open `index.html` in a browser (or run `npm run dev` from the repo root and go to `http://localhost:8000/Week3JavaScriptandDOM/Day5MiniProject/Exercises/drumset-mini/`). Press `A S D F G H J K L` or click the pads. The nine `.wav` files are already in `sounds/`.

## 🎯 The challenge

| Function | What it does |
|---|---|
| `SAMPLES` | Maps each key to a sound: A clap, S hihat, D kick, F openhat, G boom, H ride, J snare, K tom, L tink. |
| `preload()` | On the first pointer press, creates an `Audio` object for each sound (`.wav` and `.mp3`) and keeps it in `audioCache`. |
| `getAudio(sample)` | Takes the cached sound (or a new one) and returns a clone, so fast hits can overlap. |
| `play(sample)` | Lights the pad with the `playing` class for 120 ms and plays the sound. |
| `onKeyDown(e)` / `onPadClick(e)` | Turn a key press or a click on a pad into `play()`. |

Enter and Space also play whichever pad has keyboard focus.

The `.mp3` part is more of a plan than a real fallback: after `preload()` the `.wav` is always in the cache, so it always wins.

## 🧠 What I learned

- `data-key` and `data-sample` on each button tie the HTML pads to the `SAMPLES` map
- Playing a `cloneNode()` of the sound lets the same drum hit again before the first one ends
- Browsers won't play audio before the user does something, so `preload()` waits for the first `pointerdown`
- `e.target.closest(".key")` finds the pad even when the click lands on the letter inside it

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 3 Day 5 - Mini-projects - Mini Project
