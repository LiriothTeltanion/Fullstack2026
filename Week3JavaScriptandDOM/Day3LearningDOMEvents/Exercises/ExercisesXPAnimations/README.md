# 🥉 Exercises XP Animations

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xpanimations-b19d556380.svg" width="100%" alt="Progress card for Exercises XPAnimations">

</div>

Two exercises with timers: "Hello World" paragraphs that appear on a schedule, and a red box that slides across a yellow square.

## ▶️ How to run

Open either page in a browser (or use `npm run dev` from the repo root):

- `index_timer.html`: the timer starts as soon as the page loads.
- `index_move.html`: click **Click Me** to move the box.

## 🎯 The challenge

1. **Timer** (`timer.js`)
   - Part I: after 2 seconds, `alert("Hello World")`.
   - Part II: after 2 seconds, add `<p>Hello World</p>` to `#container`.
   - Part III: every 2 seconds, add another paragraph. `clearInterval` stops it when I click **Clear Interval** or when there are 5 paragraphs.
2. **Move the box** (`move.js`): `myMove()` moves `#animate` by 1px every millisecond with `setInterval` until it reaches the right edge (container width minus box width). A second click clears the old interval and starts again from the left.

More notes are in [README_Animations_XP.md](README_Animations_XP.md).

## 🧠 What I learned

- `setTimeout` fires once, `setInterval` keeps going until I call `clearInterval`
- I keep the ids in `addInterval` and `moveId` so a button or a limit check can stop them later
- Clearing `moveId` before starting means two clicks never run two intervals on the same box
- The stop point is `wrap.clientWidth - box.clientWidth`, measured when I click

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 3 Day 3 - DOM Events - Exercises XP Animations
