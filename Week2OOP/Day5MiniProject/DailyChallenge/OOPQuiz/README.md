# 💪 Daily Challenge - OOP Quiz

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/oopquiz-92469ab711.svg" width="100%" alt="Progress card for OOPQuiz">

</div>

Half theory, half code. Below are my short answers to the OOP quiz, and in [`deck.py`](deck.py) there's a deck of cards made from a `Card` class and a `Deck` class.

## ▶️ How to run

```bash
python demo.py
```

```text
🃏 Shuffled deck of 52 cards!
🖐️ Your hand:
 - Q of Clubs
 - 4 of Spades
 - 3 of Hearts
 - 5 of Spades
 - 4 of Hearts
📦 Cards left: 47
```

You get a different hand every run. `python deck.py` also deals five cards, but prints them on one line.

## 🎯 The challenge

**Part 1 - OOP answers**

- **Class**: the blueprint that says which attributes and methods its objects have
- **Instance**: one real object made from a class
- **Encapsulation**: data and the methods that use it live together, and access is controlled by convention (`_protected`) or name mangling (`__private`)
- **Abstraction**: you see what an object does, not how it does it
- **Inheritance**: a new class built on an existing one, an "is a" relationship
- **Multiple inheritance**: a class with more than one parent, which needs clear rules for finding methods
- **Polymorphism**: the same method call doing different things depending on the class
- **MRO**: the Method Resolution Order Python follows to find a method. `Class.mro()` prints it

**Part 2 - Deck of cards** ([`deck.py`](deck.py))

| Part | What it does |
|---|---|
| `Card` | A frozen dataclass with `suit` and `value`. A bad suit or value raises `ValueError`, and it prints as `A of Spades` |
| `Deck.shuffle()` | Rebuilds the full 52 cards first, then shuffles them |
| `Deck.deal()` | Pops one card, or raises `IndexError` if the deck is empty |
| `Deck.deal_many(n)` | Pops `n` cards. A negative `n` raises `ValueError`, too many raises `IndexError` |
| `len(deck)` / `iter(deck)` | How many cards are left, and a loop over them |

## 🧠 What I learned

- With `frozen=True`, trying to change `card.suit` raises an error, which is what a playing card should do
- `[Card(s, v) for s in SUITS for v in VALUES]` builds all 52 cards from 4 suits and 13 values
- Because `shuffle()` rebuilds the deck first, a reshuffle always starts from 52 cards again
- Adding `__len__` and `__iter__` was enough to make `len(deck)` and `for card in deck` work

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 2 Day 5 - Mini-projects - Daily Challenge
