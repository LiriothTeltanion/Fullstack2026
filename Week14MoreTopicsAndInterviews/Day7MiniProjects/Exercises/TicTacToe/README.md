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
