# 🥷 Exercises XP Ninja

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xpninja-1c47617020.svg" width="100%" alt="Progress card for Exercises XPNinja">

</div>

Conway's Game of Life built with inheritance in `exercisesxpninjainheritance.py`: a fixed grid and a child class whose grid grows.

## ▶️ How to run

```bash
python exercisesxpninjainheritance.py
```

It prints every generation with `█` for live cells and `.` for dead ones:

```text
=== Fixed borders demo (blinker) ===
Generation 0
.....
.....
.███.
.....
.....
...
Status: Loop detected 🔁
```

The other two demos (a glider on a fixed 10×10 grid and a glider on a growing grid) stop at their generation limit.

## 🎯 The challenge

The rules: a live cell with 2 or 3 neighbours survives, any other live cell dies, and a dead cell with exactly 3 neighbours comes alive.

| Part | What it does |
|---|---|
| `GameOfLife` | Fixed borders; `step()` builds the next grid, `run()` stops on extinction, a stable grid, a loop or the generation limit |
| `ExpandingGameOfLife` | Overrides `step()` to pad the grid on every side when a live cell reaches the edge, up to `max_size` |
| `seed_block()`, `seed_blinker()`, `seed_glider()` | Starting patterns: a still life, a period-2 oscillator and a glider |

## 🧠 What I learned

- A subclass can change one step of an algorithm and call `super().step()` for the rest
- The next generation must be built in a new grid, or early updates spoil the neighbour counts
- Saving each grid as a tuple of tuples makes it hashable, so loops can be found with a set

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 2 Day 2 - Inheritance, Encapsulation and Polymorphism - Exercises XP Ninja
