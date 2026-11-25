# 🧪 Exercise 4 - Whack-a-Mole

<div align="center">

<img src="../../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../../assets/readme/progress/exercise4-whack-a-mole-e543b0681c.svg" width="100%" alt="Progress card for Exercise4 whack a mole">

</div>

Whack-a-Mole with a 30-second clock. A hamster 🐹 jumps between nine holes, and the best five scores stay saved in the browser.

## ▶️ How to run

Open `index.html` in a browser (or use `npm run dev` from the repo root and open this folder), then click **Start (30s)** and hit the hamster as many times as you can.

## 🎯 The challenge

| Function | What it does |
|---|---|
| `buildGrid()` | Creates 9 hole buttons and one click listener for the whole grid. |
| `spawnMole()` | Clears every hole and puts the mole in a random one. |
| `startGame()` | Resets the score and the time, then starts two intervals: the clock every second and a new mole every 800 ms. |
| `onCellClick(e)` | Adds a point when the clicked hole has the mole, and moves the mole right away. |
| `endGame()` | Stops both intervals, shows `Done!` and checks the high scores. |
| `maybeRecordHighScore(sc)` | If the score makes the top 5, asks for a name, sorts the list and keeps 5 entries in `localStorage`. |

The Start button is disabled while a game runs, so a second click can't start extra timers.

## 🧠 What I learned

- The clock and the mole each have their own `setInterval`, and `endGame()` has to clear both
- High scores live under `mole_highscores_v1` in `localStorage`, so they survive closing the tab
- `b.score - a.score || a.at - b.at` sorts by score, and on a tie the older score stays ahead
- `list[4]?.score ?? -1` still works when there are fewer than five saved scores

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 3 Remote Learning - JavaScript and the DOM - Exercise 4
