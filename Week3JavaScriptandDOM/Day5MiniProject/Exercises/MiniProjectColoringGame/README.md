# 🎮 Mini Project - Coloring Game

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/mini-project-coloring-game-5320641e49.svg" width="100%" alt="Progress card for Mini Project Coloring Game">

</div>

A pixel drawing board. I pick a color, hold the mouse button down and drag across the grid, and every square I pass gets painted.

## ▶️ How to run

Open `index.html` in a browser (or run `npm run dev` from the repo root and go to `http://localhost:8000/Week3JavaScriptandDOM/Day5MiniProject/Exercises/MiniProjectColoringGame/`).

## 🎯 The challenge

| Function / handler | What it does |
|---|---|
| `build(size)` | Empties the grid and fills it with `size × size` cells, using a document fragment. |
| `paint(target)` | Sets the cell background to the current color. |
| `isCell(element)` | Checks that the mouse is over a grid cell. |
| `mousedown` / `mouseup` on the page | Turn the `drawing` flag on and off, so dragging paints only while the button is held. |
| `mouseover` on the grid | Paints each cell the mouse passes while `drawing` is on. |

- The color picker and 7 quick swatches change the color. A swatch also updates the picker.
- The size menu rebuilds the grid at 8, 16, 24 or 32 squares per side (16 to start).
- **Clear** wipes the color from every cell.

## 🧠 What I learned

- The grid has one `mouseover` listener for all the cells, and `isCell()` filters out everything else
- A single `drawing` boolean, set on `mousedown` and reset on `mouseup`, is what makes drag-painting work
- Building the cells inside a `createDocumentFragment()` puts up to 1024 of them on the page in one append
- `repeat(size, minmax(0, 1fr))` keeps the squares the same width whatever size I choose

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 3 Day 5 - Mini-projects - Mini Project
