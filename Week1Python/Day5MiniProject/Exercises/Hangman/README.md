# 🎮 Mini Project - Hangman

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/hangman-b986853f16.svg" width="100%" alt="Progress card for Hangman">

</div>

Hangman in the terminal. The game picks a random word or phrase, draws the gallows in ASCII and you can miss 6 times before you lose. [main.py](main.py) is the loop that talks to the player, and the game state, the word list and the drawings are in [src/](src/).

## ▶️ How to run

From this folder, plain Python 3:

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

- One letter per turn, upper or lower case.
- Hidden letters show as `*`, but spaces stay, so `credit card` starts as `****** ****`.
- A wrong letter costs a life and adds a piece to the drawing. Repeating a letter costs nothing, the game just tells you.
- Anything that isn't one letter prints `Input error:` with the reason, and you try again.
- Reveal every letter to win, miss 6 times to lose. Then it asks `Play again? (y/n)`.

`HangmanGame` in [src/game.py](src/game.py) stores the secret in lowercase, a `set` of guessed letters and a `wrong` counter:

| Method | What it does |
|---|---|
| `guess(ch)` | Returns `'hit'`, `'miss'` or `'repeat'`, and raises `ValueError` for invalid input. |
| `masked()` | The secret with `*` for every letter not guessed yet. |
| `is_won()` / `is_lost()` / `is_over()` | No `*` left / `wrong >= MAX_WRONG` / one of the two. |
| `gallows()` | The ASCII frame that matches the number of misses. |
| `guessed_letters()` | The guessed letters, sorted, for the status line. |

`main.py` never touches the rules. It reads input, calls the class, prints, and loops until `is_over()`.

## 🧪 Tests

From the repository root:

```bash
python -m unittest discover -s tests/python -p "test_hangman.py" -v
```

2 tests in [test_hangman.py](../../../../tests/python/test_hangman.py) cover a hit, a repeat, a win, a miss and the `ValueError` for bad input.

## 🧠 What I learned

- With the rules inside `HangmanGame`, I could test them without typing a single guess
- A `set` answers "did I already guess this?" straight away
- Raising `ValueError` in the class and catching it in `main.py` keeps bad input from ending the game
- Running `main.py` from this folder matters, because it imports `src.game` as a package

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 1 Day 5 - Mini-projects - Mini Project
