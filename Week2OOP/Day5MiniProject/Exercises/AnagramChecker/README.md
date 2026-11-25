# 🎮 Mini Project - Anagram Checker

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/anagram-checker-8fdcf3b2c3.svg" width="100%" alt="Progress card for Anagram Checker">

</div>

Type a word and the program tells you if it's in the word list, then shows every other word made of the same letters. The logic and the menu are in separate files.

## ▶️ How to run

From this folder:

```bash
python anagrams.py                  # uses the words.txt next to the script
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

Input like `hello world` is refused, and `q`, `quit` or `exit` ends the program.

## 🎯 The challenge

- [`anagramchecker.py`](anagramchecker.py) holds the `AnagramChecker` class, which never prints:

  | Method | What it does |
  |---|---|
  | `is_valid_word(word)` | `True` when the word is in the list, in any case |
  | `get_anagrams(word)` | The other words with the same letters, sorted, without the word itself |
  | `is_anagram(word1, word2)` | `True` for two different words with the same letters |

  On start it loads every word in uppercase and builds `index`, which maps sorted letters to words (`MEAT` → `AEMT` → `MATE, MEAT, META, TAME, TEAM`). A lookup is then one dictionary access.
- [`anagrams.py`](anagrams.py) is the menu. It accepts one word of letters only and lowercases the anagrams for display
- [`words.txt`](words.txt) is a small list of 49 words. A bigger list can be passed as an argument

The default list is found with `Path(__file__).with_name("words.txt")`, so the script works from any folder and on any OS. If a list is missing or empty, it prints `Word list not found or empty:` with the path and exits with code 2.

## 🧠 What I learned

- Sorting the letters gives every anagram the same "signature", so comparing words means comparing two strings
- Building the index once at startup makes each later search instant
- Because `AnagramChecker` prints nothing, a GUI or a web page could reuse it as it is
- `_normalize()` keeps only letters and uppercases them, so `Meat!` and `MEAT` count as the same word

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 2 Day 5 - Mini-projects - Mini Project
