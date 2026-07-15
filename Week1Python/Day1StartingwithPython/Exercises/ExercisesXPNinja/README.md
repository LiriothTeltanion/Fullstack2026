# 🥇 Exercises XP Ninja - Advanced Challenges

<!-- NOVA:ULTIMATE:START -->
<div align="center">

<img src="../../../../assets/readme/nova-folder-pulse.svg" width="100%" alt="Animated NOVA learning pulse">

### Exercises XPNinja

<img src="../../../../assets/readme/progress/exercises-xpninja-0250e546b7.svg" width="100%" alt="Readiness status for Exercises XPNinja">

**Goal:** Extend the lesson with advanced algorithmic and creative problem-solving challenges.

</div>

## 🧭 NOVA Folder Guide

| Metric | Value |
|---|---:|
| Readiness | **80%** |
| Files | 3 |
| Source files | 1 |
| Test files | 0 |
| Text lines | 323 |

### ▶️ Main paths

- `Week1Python/Day1StartingwithPython/Exercises/ExercisesXPNinja/exercisesxpninja.py`

### 🚀 Run

```bash
python Week1Python/Day1StartingwithPython/Exercises/ExercisesXPNinja/exercisesxpninja.py
```

### 🟢 What is already strong

- ✅ README documentation is generated and repeatable.
- ✅ Contains 1 source file(s) across practical exercises or projects.
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

<sub>Managed by NOVA Ultimate v2.0.0 · 2026-07-15T06:22:49+03:00</sub>
<!-- NOVA:ULTIMATE:END -->

**Author:** Kevin Cusnir "Lirioth"  
**Course:** Fullstack Bootcamp 2026  
**Last Updated:** October 18, 2025

**Push your Python skills with advanced problem-solving and edge-case exploration.**

## 📊 Quick Stats
- **⏰ Duration**: 45-60 minutes
- **🎯 Difficulty**: 🔴 Advanced
- **📝 Exercises**: 5
- **✅ Prerequisites**: Completed ExercisesXP and ExercisesXPGold

## 🎯 Learning Objectives

By completing these exercises, you will:
- ✅ Master terminal concepts (PATH, Python execution)
- ✅ Understand boolean arithmetic and edge cases
- ✅ Analyze complex boolean expressions
- ✅ Work with multi-line strings and character counting
- ✅ Implement input validation with constraints

---

## 📋 What's inside

### 1️⃣ Exercise 1 — Use the terminal (short notes)
- Prints tiny notes about running Python from the terminal: `python3` and the **PATH** concept.
- **🛤️ PATH** = list of folders your OS searches for programs. If Python is in PATH, you can run `python3` anywhere.

### 2️⃣ Exercise 2 — Alias (short notes)
- On **🪟 Windows**, `py` is the official Python **launcher** (it chooses the right Python version).
- On **🐧 Linux/macOS**, you can create a shell alias like `alias py='python3'` in your shell config.

### 3️⃣ Exercise 3 — Outputs (predict and show)
The script prints and demonstrates:
- `3 <= 3 < 9` → **✅ True** (chained comparisons)
- `3 == 3 == 3` → **✅ True** (all equal)
- `bool(0)` → **❌ False** (`0` is falsy)
- `bool(5 == "5")` → **❌ False** (`5 == "5"` is `False` → `bool(False)` → `False`)
- `bool(4 == 4) == bool("4" == "4")` → **✅ True** (`True == True`)
- `bool(bool(None))` → **❌ False** (`None` is falsy, so `bool(None)` is `False`)

And some boolean ↔ integer tricks:
- `x = (1 == True)` → **✅ True**; `y = (1 == False)` → **❌ False**
- `a = True + 4` → **5️⃣** (because `True` behaves like `1`)
- `b = False + 10` → **🔟** (because `False` behaves like `0`)

### 4️⃣ Exercise 4 — How many characters?
- Uses a triple-quoted string with multiple lines and prints its length.
- With the provided text **exactly as written**, `len(my_text)` is **452** (newlines and spaces count!).

### Exercise 5 — Longest sentence **without 'A'**
- Repeatedly asks you to type a sentence **without the letter 'A'** (case-insensitive).
- Type `quit` to stop.
- If your sentence is valid and longer than the current record, it updates the record and prints the new length.

> Note: The check only looks for `'a'`/`'A'`. Accented letters like **á/à** are **not** blocked by default.

---

## ▶️ How to run
### Option A — Double click (if `.py` is associated with Python)
- Save as `exercisesxpninja.py` and double click to run.

### Option B — Terminal
```bash
# macOS / Linux
python3 exercisesxpninja.py

# Windows
python exercisesxpninja.py
# or
py exercisesxpninja.py
```

You will be prompted for input during **Exercise 5**.

---

## 🧪 Example (short, trimmed)
```
True
True
False
False
True
False
x is True
y is False
a: 5
b: 10
452
Type a sentence without the letter 'A' (or 'quit' to stop): hello there
Congrats, new record: 11
Type a sentence without the letter 'A' (or 'quit' to stop): a bad try
Contains 'A'. Try again.
Type a sentence without the letter 'A' (or 'quit' to stop): this is longer
Congrats, new record: 15
Type a sentence without the letter 'A' (or 'quit' to stop): quit
Best sentence: this is longer
```

---

## 🌟 Optional improvements (nice practice)
- **Robust input loop**: In Exercise 5, allow `QUIT`, `Quit`, etc. (already handled via `.lower()`).
- **Accents**: If you want to reject `á/à/â/ä`, normalize the string or use a regex that covers them.
- **Refactor**: Move the "no 'A'" check to a function like `def has_a(s): ...` and unit-test it.
- **Counting**: Show how many attempts the user made before quitting.
- **Save record**: Write the best sentence to a file for later sessions.

---

## 📁 Files
- `exercisesxpninja.py` — Complete implementation
- `README.md` — This documentation

---

## � Troubleshooting

### Common Issues & Solutions

**❌ Problem:** Boolean expressions produce unexpected results  
**✅ Solution:** Remember that `True == 1` and `False == 0` in Python arithmetic

**❌ Problem:** Exercise 5 accepts sentences with accented letters (á, à)  
**✅ Solution:** Current implementation only checks for ASCII 'a'/'A'. To block accented variants:
```python
import unicodedata
def has_a_variant(text):
    normalized = unicodedata.normalize('NFD', text.lower())
    return 'a' in normalized
```

**❌ Problem:** Text length (Exercise 4) doesn't match expected  
**✅ Solution:** Spaces and newlines count! Copy the Lorem Ipsum text exactly as written

**❌ Problem:** Infinite loop in Exercise 5  
**✅ Solution:** Code includes `MAX_ATTEMPTS = 10` limit. Type 'quit' to exit early

---

## 💡 Learning Tips

1. **Boolean arithmetic is powerful** - Understanding `True + 4 == 5` helps with data science
2. **Chained comparisons** - `3 <= x < 9` is Python-specific and very readable
3. **String normalization** - Important for handling international text
4. **Early exits** - The 'quit' command pattern is common in CLI apps
5. **Character constraints** - Similar to password validation challenges

---

## 🏆 Challenge Extensions

Try these to level up your skills:

1. **Track statistics** - Count total attempts, success rate, average length
2. **Multiple constraints** - No 'A' AND no 'E' AND must contain 'Z'
3. **Save high scores** - Write best sentences to a JSON file
4. **Color output** - Use ANSI codes to highlight forbidden letters
5. **Regex patterns** - Accept only sentences matching complex patterns

---

## �👤 About the Author

**Kevin Cusnir "Lirioth"**  
- 🎓 Fullstack Developer Student  
- 💻 GitHub: [@Lirioth](https://github.com/Lirioth)  
- 📧 Repository: [Fullstack2026](https://github.com/Lirioth/Fullstack2026)

---

**Created with ❤️ for advanced Python mastery**
