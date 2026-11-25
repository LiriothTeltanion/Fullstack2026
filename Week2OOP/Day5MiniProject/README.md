# 🔤 Day 5 — Mini-projects

Welcome to the final project of the Python OOP module! Instead of building a large library system, Day 5 now focuses on a compact but complete **Anagram Checker** that lets you practise object-oriented design, modular thinking, file handling, and simple CLI flows all in one place.

If you prefer a detailed, learner-friendly walkthrough, jump straight to [`Exercises/AnagramChecker/README.md`](Exercises/AnagramChecker/README.md). The highlights are summarised below so the whole folder stays in sync.

---

## 🧩 What You Will Build

You will create an `AnagramChecker` class and a lightweight command-line interface that work together to:

- Validate whether a user-provided word exists in the supplied dictionary.
- Find all valid anagrams for that word (excluding the word itself).
- Offer a tiny menu so learners can explore different inputs quickly.

All of this lives in a single script, [`Exercises/AnagramChecker/anagramchecker.py`](Exercises/AnagramChecker/anagramchecker.py), which keeps the mini-project approachable while still demonstrating good design practices.

---

## 📂 Project Layout

```
Day5MiniProject/
├── DailyChallenge/
│   ├── README_ANAGRAMS.md   # Canonical, in-depth guide
│   ├── README.md            # Mirrors this overview for daily challenge context
│   └── anagram_checker_all.py
├── Exercises/
│   └── README.md            # Optional milestones if you want to rebuild the tool in stages
└── README.md                # (you are here)
```

Feel free to split the code into multiple modules (`anagram_checker.py`, `anagrams.py`) if you want a multi-file structure. The README_ANAGRAMS file explains how to do that refactor safely.

---

## ▶️ Quick Start

```bash
cd Week2OOP/Day5MiniProject/DailyChallenge
python anagram_checker_all.py
```

You will see a two-option menu: enter a word or exit. Provide a single alphabetical word and the CLI will print whether it is valid and list any anagrams.

---

## 📘 Need More Detail?

Head over to [`Exercises/AnagramChecker/README.md`](Exercises/AnagramChecker/README.md) for:

- A full description of the helper methods and CLI flow
- Notes about the bundled `words.txt` (including its auto-generation behaviour)
- Tips for extending or refactoring the project
- Git workflow reminders when you are ready to publish your work

Happy word play! 🐍✨
