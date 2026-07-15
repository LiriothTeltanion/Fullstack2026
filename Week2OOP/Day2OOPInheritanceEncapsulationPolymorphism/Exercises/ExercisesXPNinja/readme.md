# Exercises XP Ninja — Inheritance 🧠🧬

<!-- NOVA:ULTIMATE:START -->
<div align="center">

<img src="../../../../assets/readme/nova-folder-pulse.svg" width="100%" alt="Animated NOVA learning pulse">

### Exercises XPNinja

<img src="../../../../assets/readme/progress/exercises-xpninja-1c47617020.svg" width="100%" alt="Readiness status for Exercises XPNinja">

**Goal:** Extend the lesson with advanced algorithmic and creative problem-solving challenges.

</div>

## 🧭 NOVA Folder Guide

| Metric | Value |
|---|---:|
| Readiness | **80%** |
| Files | 3 |
| Source files | 1 |
| Test files | 0 |
| Text lines | 265 |

### ▶️ Main paths

- `Week2OOP/Day2OOPInheritanceEncapsulationPolymorphism/Exercises/ExercisesXPNinja/exercisesxpninjainheritance.py`

### 🚀 Run

```bash
python Week2OOP/Day2OOPInheritanceEncapsulationPolymorphism/Exercises/ExercisesXPNinja/exercisesxpninjainheritance.py
```

### 🟢 What is already strong

- ✅ README documentation is generated and repeatable.
- ✅ Contains 1 source file(s) across practical exercises or projects.
- ✅ No Python syntax error was detected in this folder tree.
- ✅ A likely runnable entry point was detected.

### 🟠 What to improve next

- ⚠️ No local unit test is present yet; repository-wide syntax checks still cover the sources.

### 🧪 Validation

```bash
python tools/nova_quality_gate.py --repo . --strict
python -m unittest discover -s tests/python -p "test_*.py" -v
node tools/run_node_tests.mjs .
```

> The readiness value is a transparent repository heuristic, not a course grade and not proof that every interactive or external-API exercise was executed.

<sub>Managed by NOVA Ultimate v2.0.0 · 2026-07-15T06:22:49+03:00</sub>
<!-- NOVA:ULTIMATE:END -->

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
