# 🧠 Daily Challenge: OOP Quizz + 🃏 Deck of Cards (Minimal Solution)

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/oopquiz-92469ab711.svg" width="100%" alt="Progress card for OOPQuiz">

</div>

This package includes:
- **Exercise 1:** concise OOP answers ✅
- **Exercise 2:** working `Card` + `Deck` implementation with `shuffle()` and `deal()` / `deal_many()` ✅

---

## 📚 Exercise 1 — OOP Answers (concise)

- **Class** 🏗️ A blueprint defining attributes and methods for objects.
- **Instance** 🧩 A concrete object created from a class.
- **Encapsulation** 🔒 Bundle data + methods; control access (public / _protected / __name-mangled by convention).
- **Abstraction** 🎭 Expose essentials; hide implementation details.
- **Inheritance** 🧬 Create new classes from existing ones (is‑a relationship).
- **Multiple inheritance** 🧵 Inherit from multiple bases; requires clear lookup rules.
- **Polymorphism** 🦎 Same interface, different behaviors (overriding, duck typing).
- **MRO** 🧭 Method Resolution Order (C3 linearization). Inspect with `Class.__mro__` / `Class.mro()`.

---

## 🚀 Quickstart

```bash
# Run the demo
python demo.py

# Or run the module directly
python deck.py
```

**Expected output (example):**
```
🃏 Shuffled deck of 52 cards!
🖐️ Your hand:
 - 7 of Hearts
 - K of Clubs
 - A of Spades
 - 10 of Diamonds
 - 3 of Clubs
📦 Cards left: 47
```

---

## 🗂️ Files

```text
deck.py   # Card + Deck classes with shuffle(), deal(), deal_many() ✨
demo.py   # Simple usage example 🎬
README.md # Theory + usage 📘
```

---

## ✅ Notes

- Neutral tone; no external references. 🤝
- Helpful emojis in comments and README for readability. ✨
