# Tic-Tac-Toe 🎮

Classic two-player tic-tac-toe implemented as a simple CLI exercise for Day 5 of Week 1.

## Overview
- 3×3 board rendered with row and column headers.
- Players `X` and `O` alternate turns by typing coordinates like `2 3`.
- Input validation prevents out-of-range moves or overwriting occupied cells.
- Automatic win detection for rows, columns, and diagonals.
- Detects stalemates when the board is full.
- Optional replay loop lets you dive right back into another match.

## Running The Game
```pwsh
python tictactoe.py
```

## Game Controls
- Enter two numbers separated by a space: `row column` (each 1–3).
- Example: `2 3` marks row 2, column 3.
- Enter `Ctrl+C` to quit at any time.

## Next Steps
If you want to extend the project:
1. Add an AI opponent using minimax or heuristics.
2. Track player scores across rounds.
3. Export game history to a log file.
