# 🛠️ Optional Day 5 Milestones – Anagram Checker

The original step-by-step exercises for a library system are now **deprecated**. Day 5 focuses solely on the Anagram Checker mini-project that lives in [`../DailyChallenge`](../DailyChallenge). If you would like structured milestones to rebuild the solution from scratch, follow the sequence below.

> 📚 Need the complete write-up? Read [`AnagramChecker/README.md`](AnagramChecker/README.md). It contains the official project description, file details, and extension ideas.

---

## 🥉 Milestone 1 – Load the Dictionary

- Create a helper function that reads `words.txt` and returns both a set of valid words and a mapping of sorted-letter signatures to word lists.
- Ensure the loader can create `words.txt` with a sensible default list when the file is missing (see README_ANAGRAMS for the fallback content).
- Add light error handling so the script exits gracefully if the file cannot be created or read.

## 🥈 Milestone 2 – Implement `AnagramChecker`

- Build the `AnagramChecker` class around the loader from Milestone 1.
- Implement and test the trio of public methods used by the CLI:
  - `is_valid_word(word)`
  - `get_anagrams(word)`
  - `is_anagram(word_one, word_two)`
- Keep the methods free of `print` statements; return values instead so they can be reused.

## 🥇 Milestone 3 – Craft the CLI

- Wrap the class in a small menu-driven interface (exactly what `anagram_checker_all.py` provides).
- Validate user input, format the output clearly, and display friendly emojis to match the all-in-one reference implementation.
- When everything works, compare your solution with `anagram_checker_all.py` to spot improvements or refactors you might borrow.

---

## ✅ When Are You Done?

- [ ] Each milestone runs without errors and uses the same behaviours documented in `README_ANAGRAMS.md`.
- [ ] Your final script can either be the provided `anagram_checker_all.py` or a refactored two-file version.
- [ ] You have explored at least a couple of stretch ideas (larger dictionary, unit tests, different UI) if time permits.

Enjoy levelling up your string-manipulation skills! 🔡🚀
