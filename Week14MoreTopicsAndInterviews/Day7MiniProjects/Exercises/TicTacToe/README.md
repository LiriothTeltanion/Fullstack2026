# 🎮 Mini Project - Tic Tac Toe

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

A React version of tic-tac-toe with two-player and computer modes, reset, all eight winning lines and a draw result. The computer uses minimax and plays O.

## ▶️ How to run

    npm install
    npm run dev

Vite prints the local URL. npm run build creates the production files.

## 🎯 The challenge

- Two people alternate X/O on the same device, or X plays against the computer.
- Occupied cells and finished boards refuse extra moves.
- Switching mode starts a new board and cancels a pending computer reply.
- Reset also cancels a pending reply.
- The result is announced and the winning line is highlighted.

## 🧩 Code

[game.js](src/game.js) keeps board rules and minimax separate from React. The eight win checks adapt the existing [Week 1 Python game](../../../../Week1Python/Day5MiniProject/Exercises/TicTacToe/tictactoe.py). [App.jsx](src/App.jsx) owns the UI and delayed computer turn.

---

## 👤 Author

Kevin Cusnir · Fullstack2026 · Week 14 Day 7

## Mode buttons and repeatable verification

The two play modes are ordinary keyboard-operable buttons grouped by a fieldset. `aria-pressed` exposes the current mode. Selecting a different mode resets the board; selecting the active mode preserves the current round. Switching mode or resetting cancels the pending computer reply. Board rules and the minimax strategy are unchanged.

Use Node 22.13+ on the 22.x line, or Node 24+, then run `npm ci`, `npm test` and `npm run build`. The portable lock pins the installed dependencies. Tests cover all eight winning lines, draw/invalid moves and exhaustive legal human play against the computer. Private browser checks cover the actual buttons and keyboard/mobile behavior; no teacher grade or learner mastery is implied.

Built with AI-assisted tooling; functionality is tested separately from learner review.
