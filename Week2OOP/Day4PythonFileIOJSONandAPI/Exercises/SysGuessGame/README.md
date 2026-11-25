# 🎲 Exercise - Sys Built-in Module Guess Game

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

A number guessing game using `sys.argv` and the standard `random` module.

## ▶️ How to run

```bash
python guess_game.py
python guess_game.py 20 25
python guess_game.py -4 2
```

With no arguments, the inclusive range is 1–10. Pass exactly two integer bounds to change it. Reversed bounds and invalid arguments return an error. Equal bounds are valid.

The script keeps asking until I guess the number. Text and out-of-range inputs get an explanation and do not increase the valid-attempt counter. Ctrl+C or end-of-input ends the game.

## What I can explain

- `sys.argv[1:]` excludes the script name.
- `random.randint(start, end)` includes both ends.
- A retry loop should distinguish a malformed guess from a valid wrong guess.
- Function parameters let tests choose a known secret without altering normal random play.

Created 2026-11-25, Asia/Jerusalem.
