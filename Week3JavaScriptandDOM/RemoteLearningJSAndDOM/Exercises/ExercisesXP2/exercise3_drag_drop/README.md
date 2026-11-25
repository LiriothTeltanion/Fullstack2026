# 🧪 Exercise 3 - Drag and Drop

<div align="center">

<img src="../../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../../assets/readme/progress/exercise3-drag-drop-5279c0a41a.svg" width="100%" alt="Progress card for Exercise3 drag drop">

</div>

Drag a red box into a yellow target. Dropped fully inside, it centers itself; dropped outside, it jumps back to where it started.

## ▶️ How to run

Open `index.html` in a browser (or use `npm run dev` from the repo root and open this folder), then drag the red box with the mouse or a finger.

## 🎯 The challenge

| Handler / function | What it does |
|---|---|
| `pointerdown` | Starts dragging, captures the pointer and remembers where the pointer and the box started. |
| `pointermove` | Moves the box by the distance the pointer has travelled. |
| `isInsideTarget(el, tgt)` | Compares the two `getBoundingClientRect()` boxes to see if the box is fully inside the target. |
| `pointerup` | Centers the box in the target, or sends it back to its original place. |

## 🧠 What I learned

- Pointer events work for both mouse and touch with the same code
- `setPointerCapture` keeps the drag going even if the pointer leaves the box
- `getBoundingClientRect()` gives the position and size I need to check overlaps
- Saving the starting `offsetLeft` and `offsetTop` makes "snap back" easy

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 3 Remote Learning - JavaScript and the DOM - Exercise 3
