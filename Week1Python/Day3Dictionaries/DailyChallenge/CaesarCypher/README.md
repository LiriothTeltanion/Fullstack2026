# 🌟 Daily Challenge Gold - Caesar Cipher

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/caesar-cypher-c2aae16993.svg" width="100%" alt="Progress card for Caesar Cypher">

</div>

A Caesar cipher in [caesarcipher.py](caesarcipher.py) with encrypt, decrypt and brute-force modes. It works with an interactive menu or with command-line flags.

## ▶️ How to run

Interactive menu (choose `E`ncrypt, `D`ecrypt, `B`rute-force or `Q`uit):

```bash
python caesarcipher.py
```

With flags:

```bash
python caesarcipher.py --mode encrypt --shift 3 --text "Hello, World!"
# Khoor, Zruog!
python caesarcipher.py --mode decrypt --shift 3 --text "Khoor, Zruog!"
# Hello, World!
python caesarcipher.py --mode brute --text "Khoor, Zruog!"
# shift= 0: Khoor, Zruog!
# ...
# shift= 3: Hello, World!
```

## 🎯 The challenge

| Function | What it does |
|---|---|
| `_shift_char(ch, shift)` | Turns a letter into a 0-25 index, adds the shift, wraps with `% 26` and turns it back. Case is kept, and spaces, digits and punctuation pass through unchanged. |
| `encrypt(text, shift)` | Shifts every letter forward. Negative shifts work too. |
| `decrypt(text, shift)` | Shifts every letter back. |
| `brute_force(text)` | Tries all 26 shifts, so an unknown shift can be read by eye. |
| `interactive_main()` / `cli_main()` | The menu loop, and the `argparse` version used when flags are given. |

## 🧠 What I learned

- `ord()` and `chr()` turn letters into numbers and back
- The modulo `% 26` makes Z wrap around to A
- `argparse` gives a script real command-line flags with very little code

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 1 Day 3 - Dictionaries - Daily Challenge Gold
