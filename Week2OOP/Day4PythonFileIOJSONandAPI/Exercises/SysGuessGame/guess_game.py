"""Guess an inclusive random integer using optional command-line bounds."""
from __future__ import annotations

import random
import sys
from typing import Callable


def bounds(arguments: list[str]) -> tuple[int, int]:
    """Use 1..10 by default, otherwise require two ordered integer bounds."""
    if not arguments:
        return 1, 10
    if len(arguments) != 2:
        raise ValueError("Usage: python guess_game.py [start end]")
    try:
        start, end = map(int, arguments)
    except ValueError as error:
        raise ValueError("Start and end must both be integers.") from error
    if start > end:
        raise ValueError("Start must be less than or equal to end.")
    return start, end


def play(
    start: int,
    end: int,
    read: Callable[[str], str] = input,
    write: Callable[[str], None] = print,
    choose: Callable[[int, int], int] = random.randint,
) -> int:
    """Retry invalid guesses and return the number of valid attempts on success."""
    if start > end:
        raise ValueError("Start must be less than or equal to end.")
    target = choose(start, end)
    attempts = 0
    while True:
        try:
            guess = int(read(f"Guess a number from {start} to {end}: "))
        except ValueError:
            write("Please enter a whole number.")
            continue
        if not start <= guess <= end:
            write(f"Stay within {start} and {end}, inclusive.")
            continue
        attempts += 1
        if guess == target:
            write(f"You found it in {attempts} valid attempt(s)!")
            return attempts
        write("Try again.")


def main() -> None:
    try:
        start, end = bounds(sys.argv[1:])
        play(start, end)
    except ValueError as error:
        print(error, file=sys.stderr)
        raise SystemExit(2) from error
    except (EOFError, KeyboardInterrupt):
        print("\nGame ended.")


if __name__ == "__main__":
    main()
