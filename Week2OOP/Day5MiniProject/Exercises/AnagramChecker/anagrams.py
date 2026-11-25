"""
File: anagrams.py
Purpose: Minimal CLI/UI for the Anagram Checker. 🖥️🧑‍💻
Note: Delegates all logic to `AnagramChecker`; handles I/O, validation, and formatting. 🎛️
"""

from __future__ import annotations

import sys
from anagramchecker import BUNDLED_WORDS, AnagramChecker, _normalize

# The banner and messages use emoji; make them safe on Windows consoles.
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")


BANNER = r"""
   ★ ANAGRAM CHECKER ★
Type a word to see its anagrams, or 'q' to quit.
"""

def _is_single_alpha_token(s: str) -> bool:
    """Single space‑separated token, letters only. 🧪"""
    s = s.strip()
    return bool(s) and (" " not in s) and s.isalpha()


def run(wordlist_path: str = str(BUNDLED_WORDS)) -> int:
    checker = AnagramChecker(wordlist_path=wordlist_path)
    if not checker.words:
        print(f"Word list not found or empty: {wordlist_path}")
        print("Please supply a valid words.txt (one word per line).")
        return 2

    print(BANNER)
    while True:
        raw = input("Enter a word (or 'q' to quit): ").strip()
        if raw.lower() in {"q", "quit", "exit"}:
            print("Bye!")
            return 0
        # Input validation 🧰
        if not _is_single_alpha_token(raw):
            print("Invalid input: enter a single alphabetic word (no spaces, numbers, or symbols).")
            continue

        token = _normalize(raw)  # display in UPPER
        valid = checker.is_valid_word(token)
        print(f'\nYOUR WORD: "{token}"')
        print("This is a valid English word." if valid else "This is NOT a valid English word.")
        if valid:
            anas = checker.get_anagrams(token)
            if anas:
                print("Anagrams for your word:", ", ".join(w.lower() for w in anas))
            else:
                print("No anagrams found in the current word list.")
        print()

if __name__ == "__main__":
    # Allow optional path: `python anagrams.py /path/to/words.txt` (default: the bundled words.txt)
    path = sys.argv[1] if len(sys.argv) > 1 else str(BUNDLED_WORDS)
    raise SystemExit(run(path))
