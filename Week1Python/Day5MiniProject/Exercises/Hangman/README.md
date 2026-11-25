# 🎮 Mini Project - Hangman

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/hangman-b986853f16.svg" width="100%" alt="Progress card for Hangman">

</div>

A Hangman game for the terminal. It picks a random word or phrase, shows ASCII gallows, and gives you 6 wrong guesses before you lose. [main.py](main.py) runs the game loop; the game state, word list and gallows art live in [src/](src/).

## ▶️ How to run

From this folder (no external packages, just Python 3):

```bash
python main.py
```

```
Word: ****** ****
Lives: 6

Enter a letter: r
✅ Hit!
Word:  *r**** **r*
Guessed: r
Lives: 6
```

## 🎯 The challenge

- Type one letter and press Enter. Upper or lower case both work.
- Letters you haven't found show as `*`. Spaces stay visible, so `credit card` starts as `****** ****`.
- A wrong letter costs a life and adds a piece to the gallows. Guessing the same letter again doesn't cost anything.
- Anything that isn't a single letter shows an input error and lets you try again.
- You win when every letter is revealed and lose after 6 misses. Then the game asks `Play again? (y/n)`.

`HangmanGame` in [src/game.py](src/game.py) keeps the secret in lowercase, a `set` of guessed letters and a counter of wrong guesses:

| Method | What it does |
|---|---|
| `guess(ch)` | Returns `'hit'`, `'miss'` or `'repeat'`, and raises `ValueError` for invalid input. |
| `masked()` | The secret with `*` for unknown letters. |
| `is_won()` / `is_lost()` / `is_over()` | No `*` left / `wrong >= MAX_WRONG` / either one. |
| `gallows()` | The ASCII frame for the current wrong count. |
| `guessed_letters()` | The guessed letters, sorted for display. |

`main.py` only handles input and printing. It loops until `is_over()`, then shows the result and asks about another round.

## 🧪 Tests

From the repository root:

```bash
python -m unittest discover -s tests/python -p "test_hangman.py" -v
```

2 tests in [test_hangman.py](../../../../tests/python/test_hangman.py) check hits, repeats, a win, a miss and the `ValueError` for invalid input.

## 🧠 What I learned

- Keeping game logic in a class and the user interface in `main.py`
- Using a `set` to find repeated guesses quickly
- Validating input with `ValueError` and `try/except`
- Organizing a project into modules and importing them

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 1 Day 5 - Mini-projects - Mini Project
