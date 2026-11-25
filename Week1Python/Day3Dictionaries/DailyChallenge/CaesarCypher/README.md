# Daily Challenge GOLD — Caesar Cipher 🔐🧠

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/caesar-cypher-c2aae16993.svg" width="100%" alt="Progress card for Caesar Cypher">

</div>

A clean Python implementation of the **Caesar cipher** with **encrypt**, **decrypt**, and **brute-force** modes.

## ✅ Features
- Shifts letters with wrap‑around (A↔Z, a↔z), preserves case.
- Leaves non‑letters (spaces, punctuation, digits) unchanged.
- Works **interactively** or with **CLI flags**.
- Accepts positive or negative shifts.

## ▶️ Run (interactive)
```bash
python caesarcipher.py
```
Then choose: **E**ncrypt / **D**ecrypt / **B**rute‑force / **Q**uit.

## ▶️ Run (CLI)
```bash
# Encrypt
python caesarcipher.py --mode encrypt --shift 3 --text "Hello, World!"
# -> Khoor, Zruog!

# Decrypt
python caesarcipher.py --mode decrypt --shift 3 --text "Khoor, Zruog!"
# -> Hello, World!

# Brute-force (unknown shift)
python caesarcipher.py --mode brute --text "Khoor, Zruog!"
```

## 🧪 How it works
For each letter: convert to a 0–25 index, add the shift, wrap modulo 26, and convert back. Non‑letters pass through untouched.

## 📝 File
- `caesarcipher.py` — single‑file solution (no external deps).

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 1 Day 3 - Daily Challenge

---

Have fun encrypting like Julius Caesar! 🏺✨
