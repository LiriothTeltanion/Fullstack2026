# Exercises XP Ninja — Inheritance 🧠🧬

Conway's Game of Life implemented with **inheritance** in a **single Python file**: `exercisesxpninjainheritance.py` + this `readme.md`.  
Docstrings and comments in **English**. Emojis included. ✨

## Classes
- **GameOfLife** (fixed borders) — base class
- **ExpandingGameOfLife** (ever-expandable) — subclass, grows the grid when activity reaches borders (up to `max_size`, default 10,000)

## Rules (recap)
- Live cell with <2 neighbors → dies (underpopulation)  
- Live cell with 2–3 neighbors → survives  
- Live cell with >3 neighbors → dies (overpopulation)  
- Dead cell with exactly 3 neighbors → becomes alive (reproduction)

## Display
- The grid is printed after each generation using `█` for live and `.` for dead.

## Run
```bash
python exercisesxpninjainheritance.py
```
The `__main__` block runs three demos:
1) Fixed borders + blinker (oscillator)  
2) Fixed borders + glider (eventually collides and ends)  
3) Expanding borders + glider (keeps traveling as the grid grows)  

The engine detects extinction, stability, and loops, or stops at a generation cap.

## Seeds
- `seed_block()` still life  
- `seed_blinker()` oscillator (period 2)  
- `seed_glider()` classic glider  

## Quick import
```python
from exercisesxpninjainheritance import GameOfLife, ExpandingGameOfLife, seed_glider

game = GameOfLife(20, 20, seed=[(r+5, c+5) for (r,c) in seed_glider()])
game.run(50, show=True)
```
Have fun experimenting! 💙
