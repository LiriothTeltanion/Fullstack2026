# 🎮 Mini Project - Anagram Checker

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/anagram-checker-8fdcf3b2c3.svg" width="100%" alt="Progress card for Anagram Checker">

</div>

A command-line tool that checks if a word is in a word list and shows its anagrams. The logic and the menu live in two separate files.

## ▶️ How to run

From this folder:

```bash
python anagrams.py                  # uses words.txt here
python anagrams.py path/to/words.txt
```

```text
   ★ ANAGRAM CHECKER ★
Type a word to see its anagrams, or 'q' to quit.

Enter a word (or 'q' to quit): meat

YOUR WORD: "MEAT"
This is a valid English word.
Anagrams for your word: mate, meta, tame, team
```

## 🎯 The challenge

- [`anagramchecker.py`](anagramchecker.py) - the `AnagramChecker` class, which prints nothing:

  | Method | What it does |
  |---|---|
  | `is_valid_word(word)` | `True` if the word is in the list (case-insensitive) |
  | `get_anagrams(word)` | The other words with the same letters, sorted, without the word itself |
  | `is_anagram(word1, word2)` | `True` if two different words use the same letters |

  It loads the words in uppercase and builds an index from each word's sorted letters (`MEAT` → `AEMT`) to its bucket of words, so a lookup is a single dictionary access.
- [`anagrams.py`](anagrams.py) - the menu: it only accepts one word made of letters, and `q` quits
- [`words.txt`](words.txt) - a small list of 49 words; it can be swapped for a bigger one

## 🧠 What I learned

- Two words are anagrams when their sorted letters are the same
- Precomputing an index once makes every later search fast
- Keeping `print` out of the class means the same logic could power a different interface
- Normalizing input (letters only, uppercase) before comparing avoids many small bugs

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 2 Day 5 - Mini-projects - Mini Project
