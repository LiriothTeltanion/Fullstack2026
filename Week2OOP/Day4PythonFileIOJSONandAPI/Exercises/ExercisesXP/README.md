# 🥉 Exercises XP

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xp-7736123bb3.svg" width="100%" alt="Progress card for Exercises XP">

</div>

Both Files and JSON XP tasks in one script, `xp_files_json_all.py`: a random sentence generator and a small JSON edit.

## ▶️ How to run

```bash
python xp_files_json_all.py
```

```text
===== Exercise 1: Random Sentence (demo length=6) =====
📝 (six random words)

===== Exercise 2: JSON Access/Modify/Save =====
Employee salary is: 7000 💰
Modified JSON saved to: .../modified_employee.json ✅
```

The script writes `words.txt` (if it is missing) and `modified_employee.json` in the folder you run it from. To try the interactive prompt of exercise 1, import the module and call `main()`.

## 🎯 The challenge

1. **Random sentence generator** - `get_words_from_file()` reads the words (and creates `words.txt` with a default list the first time), `get_random_sentence(length)` picks random words and returns them in lowercase, and `main()` asks for a length and only accepts a whole number from 2 to 20
2. **Working with JSON** - `process_employee_json()` parses a sample JSON string, prints the nested salary, adds a `birth_date` to the employee and saves the result with `json.dump(..., indent=2)`

## 🧠 What I learned

- `pathlib.Path` makes it easy to check for a file, read it and write it
- `json.loads` turns a JSON string into nested dictionaries I can walk with keys
- Checking the input range before using it keeps the generator from doing odd things
- Relative file paths depend on where I run the script, not where the script lives

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 2 Day 4 - File I/O, JSON and APIs - Exercises XP
