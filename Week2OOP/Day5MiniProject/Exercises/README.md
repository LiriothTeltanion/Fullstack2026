# 🛠️ Optional Day 5 Milestones – Anagram Checker

<!-- NOVA:ULTIMATE:START -->
<div align="center">

<img src="../../../assets/readme/nova-folder-pulse.svg" width="100%" alt="Animated NOVA learning pulse">

### Exercises

<img src="../../../assets/readme/progress/exercises-1e195418da.svg" width="100%" alt="Readiness status for Exercises">

**Goal:** Organize practical exercises with clear goals, execution paths, validation, and improvement guidance.

</div>

## 🧭 NOVA Folder Guide

| Metric | Value |
|---|---:|
| Readiness | **80%** |
| Files | 15 |
| Source files | 6 |
| Test files | 0 |
| Text lines | 791 |

### ▶️ Main paths

- `Week2OOP/Day5MiniProject/Exercises/AnagramChecker/anagramchecker.py`
- `Week2OOP/Day5MiniProject/Exercises/AnagramChecker/anagrams.py`
- `Week2OOP/Day5MiniProject/Exercises/RockPaperScissors/game.py`

### 🚀 Run

```bash
python Week2OOP/Day5MiniProject/Exercises/AnagramChecker/anagramchecker.py
python Week2OOP/Day5MiniProject/Exercises/AnagramChecker/anagrams.py
python Week2OOP/Day5MiniProject/Exercises/RockPaperScissors/game.py
```

### 🟢 What is already strong

- ✅ README documentation is generated and repeatable.
- ✅ Contains 6 source file(s) across practical exercises or projects.
- ✅ No Python syntax error was detected in this folder tree.
- ✅ A likely runnable entry point was detected.

### 🟠 What to improve next

- ⚠️ No local unit test is present yet; repository-wide syntax checks still cover the sources.

### 🧪 Validation

```bash
python tools/nova_quality_gate.py --repo . --strict
python -m unittest discover -s tests/python -p "test_*.py" -v
node tools/run_node_tests.mjs .
```

> The readiness value is a transparent repository heuristic, not a course grade and not proof that every interactive or external-API exercise was executed.

<sub>Managed by NOVA Ultimate v2.0.0 · 2026-07-15T06:22:48+03:00</sub>
<!-- NOVA:ULTIMATE:END -->

The original step-by-step exercises for a library system are now **deprecated**. Day 5 focuses solely on the Anagram Checker mini-project that lives in [`../DailyChallenge`](../DailyChallenge). If you would like structured milestones to rebuild the solution from scratch, follow the sequence below.

> 📚 Need the complete write-up? Read [`../DailyChallenge/README_ANAGRAMS.md`](../DailyChallenge/README_ANAGRAMS.md). It contains the official project description, file details, and extension ideas.

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
