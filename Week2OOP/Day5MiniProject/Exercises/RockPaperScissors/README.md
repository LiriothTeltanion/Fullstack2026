# 🎮 Mini Project - Rock Paper Scissors

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/rock-paper-scissors-37d39eddc9.svg" width="100%" alt="Progress card for Rock Paper Scissors">

</div>

Rock, paper, scissors against the computer, split into two modules so the rules stay separate from the menu.

## ▶️ How to run

From this folder:

```bash
python rockpaperscissors.py
```

```text
=== Rock–Paper–Scissors ===
1) Play a new game 🎮
2) Show scores 📊
3) Quit 🚪
Choose 1/2/3 (or p/s/q): 1
Choose [r]ock, [p]aper, or [s]cissors: r
You chose 🪨  rock | Computer chose 📄  paper
Result: You LOSE. 😿
```

## 🎯 The challenge

- [`game.py`](game.py) - the `Game` class:

  | Method | What it does |
  |---|---|
  | `get_user_item()` | Asks until the answer is `r`, `p`, `s` or a full word (any case) |
  | `get_computer_item()` | Picks a random item with the `random.Random` the game holds |
  | `get_game_result(user, computer)` | Returns `"win"`, `"loss"` or `"draw"` using a "what beats what" dictionary |
  | `play()` | Runs one round, prints both choices and the result, and returns it |

- [`rockpaperscissors.py`](rockpaperscissors.py) - the menu: play a round, show the scores, or quit with a final summary of wins, losses and draws

## 🧠 What I learned

- A dictionary like `{"rock": "scissors", ...}` replaces a long chain of `if` checks
- Returning the result from `play()` lets the menu keep score without knowing the rules
- Mapping several inputs (`1` or `p`) to one action makes a menu friendlier

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 2 Day 5 - Mini-projects - Mini Project
