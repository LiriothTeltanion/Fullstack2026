# Files & JSON XP – Combined Solutions ✨

This folder contains a single script, `xp_files_json_all.py`, that solves the two Files & JSON XP tasks:

1. **Random Sentence Generator** – builds a sentence of user-defined length by reading from `words.txt`.
2. **JSON Manipulation** – reads a sample employee record, displays the salary, adds a `birth_date`, and saves the updated data.

`words.txt` is created automatically the first time the script runs (with a small default list) so you can launch the exercises immediately. Feel free to edit the file to include your own vocabulary.

---

## ✅ Requirements

- Python **3.10+** (standard library only)

---

## ▶️ Quick Demo

From this directory run:

```bash
python xp_files_json_all.py
```

The script will:

- Generate a lowercase random sentence with 6 words.
- Display the original salary stored in the JSON payload.
- Save the modified data to `modified_employee.json` in the same folder.

---

## 🧑‍💻 Interactive Sentence Generator

To use the interactive prompt from Exercise 1, import and call `main()`:

```python
from xp_files_json_all import main
main()  # Follow the on-screen instructions 😊
```

Valid input is an integer between **2 and 20** (inclusive). The words are sourced from `words.txt` every time you run the generator, so updates to the file are reflected automatically.

---

## 📦 Output Files

- `modified_employee.json` – Created after the JSON exercise runs, containing the additional `"birth_date"` field.
- `words.txt` – Auto-generated on first run if missing; you may customize it anytime.

Enjoy exploring both exercises in one place! 🐍💙
