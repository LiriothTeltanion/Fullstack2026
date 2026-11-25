# 🧪 Exercise 2 - Move the Box

<div align="center">

<img src="../../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../../assets/readme/progress/exercise2-move-box-209d23ba9d.svg" width="100%" alt="Progress card for Exercise2 move box">

</div>

Click a button and a red box slides 1px every millisecond to the right edge of a yellow square.

## ▶️ How to run

Open `index.html` in a browser (or use `npm run dev` from the repo root and open this folder) and click **Click Me**.

## 🎯 The challenge

- `myMove()` clears any animation that is already running, so two intervals never stack.
- It reads the box's current `left` with `getComputedStyle` and works out the limit: container width minus box width (400 − 50 = 350px).
- `setInterval(..., 1)` adds 1px to `left` each time and clears itself when the box reaches the limit.

The box keeps its place after the animation, so clicking again at the edge does not move it.

## 🧠 What I learned

- `getComputedStyle(box).left` gives the real position, even when it comes from CSS
- `clientWidth` helps me find where the box must stop
- Clearing the old interval before starting a new one avoids double speed
- `position: absolute` inside a `position: relative` container lets `left` move the box

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 3 Remote Learning - JavaScript and the DOM - Exercise 2
