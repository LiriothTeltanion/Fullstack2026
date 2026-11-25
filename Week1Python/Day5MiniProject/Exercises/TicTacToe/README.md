# 🎮 Mini Project - Tic-Tac-Toe

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/tic-tac-toe-ed49f2ef4e.svg" width="100%" alt="Progress card for Tic Tac Toe">

</div>

Tic-tac-toe for two people at one keyboard, all in [tictactoe.py](tictactoe.py). `X` and `O` take turns on a 3×3 board until one of them gets three in a row or there are no empty cells left.

## ▶️ How to run

```bash
python tictactoe.py
```

A move is the row and the column, 1 to 3 each, with a space between, like `2 3`:

```
Player X, enter row and col (1-3 1-3) 🙂: 1 3
  1 2 3
1 X|X|X
  -----
2 O|O| 
  -----
3  | | 
Player X wins!
🔄 Play again? (y/n): n
👋 Thanks for playing! Goodbye! 🎉
```

## 🎯 The challenge

| Function | What it does |
|---|---|
| `new_board()` | A list of three lists, each with three `' '`. |
| `display_board(board)` | Prints the grid with row and column numbers. |
| `parse_move(user_input)` | Turns `"2 3"` into `(1, 2)`. Anything that isn't two numbers raises `ValueError`. |
| `validate_move(board, user_input)` | Also says no to cells outside the board or already taken. |
| `player_input(board, player)` | Asks again and again until the move is valid, printing the error each time. |
| `check_win(board, player)` | Looks at the three rows, the three columns and both diagonals. |
| `is_tie(board)` | `True` once every cell is filled. |
| `play()` / `main()` | One full game, then the "Play again?" loop (`y` or `yes` to continue). |

## 🧪 Tests

From the repository root:

```bash
python -m unittest discover -s tests/python -p "test_tictactoe.py" -v
```

3 tests in [test_tictactoe.py](../../../../tests/python/test_tictactoe.py) check the empty board, parsing a move, a win by row, column and diagonal, a tie and an invalid move.

## 🧠 What I learned

- `board[row][col]` on a list of lists maps nicely to how the grid looks on screen
- The player types 1 to 3 but the list uses 0 to 2, so `parse_move()` subtracts 1 in one place
- `check_win()` runs right after each move, before the tie check, so a full board with a winner counts as a win
- Raising errors in `validate_move()` and catching them in `player_input()` kept the rules apart from the prompting

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 1 Day 5 - Mini-projects - Mini Project
