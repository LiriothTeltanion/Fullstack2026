# 🎮 Mini Project - Rock Paper Scissors

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/rock-paper-scissors-37d39eddc9.svg" width="100%" alt="Progress card for Rock Paper Scissors">

</div>

The classic game against the computer. One module knows the rules, the other runs the menu and keeps score.

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

The computer's pick is random, so your result will vary.

## 🎯 The challenge

- [`game.py`](game.py) holds the `Game` class:

  | Method | What it does |
  |---|---|
  | `get_user_item()` | Keeps asking until it gets `r`, `p`, `s` or the full word, in any case (`scissor` works too) |
  | `get_computer_item()` | Random choice through the game's `random.Random` |
  | `get_game_result(user, computer)` | `"win"`, `"loss"` or `"draw"`, using a dict of what beats what |
  | `play()` | One round: both picks, the printed result, and the result returned |

- [`rockpaperscissors.py`](rockpaperscissors.py) is the menu: play, show the scores, or quit with a summary of wins, losses and draws. "Show scores" and quitting share `print_results()`; only quitting passes `final=True`, which prints `=== Final Results ===` and `Thanks for playing!`

```text
=== Scores so far ===
Wins: 0  |  Losses: 1  |  Draws: 0
```

## 🧠 What I learned

- `wins_against = {"rock": "scissors", ...}` decides every round in one line, no `if / elif` tree
- `play()` returns `"win"`, `"loss"` or `"draw"`, and the menu just adds 1 to that key in `results`
- A mapping like `{"1": "p", "p": "p", ...}` lets the menu accept both numbers and letters

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 2 Day 5 - Mini-projects - Mini Project
