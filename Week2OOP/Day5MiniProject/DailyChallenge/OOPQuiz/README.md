# 💪 Daily Challenge - OOP Quiz

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/oopquiz-92469ab711.svg" width="100%" alt="Progress card for OOPQuiz">

</div>

Two parts: short answers to the OOP quiz questions, and a deck of cards built with a `Card` and a `Deck` class.

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

The hand is random on every run. `python deck.py` prints a shorter one-line version.

## 🎯 The challenge

**Part 1 - OOP answers**

- **Class**: a blueprint that defines the attributes and methods of its objects
- **Instance**: one concrete object created from a class
- **Encapsulation**: keeping data and the methods that use it together, and controlling access (`_protected`, `__name_mangled`)
- **Abstraction**: showing what an object does and hiding how it does it
- **Inheritance**: building a new class from an existing one (an "is a" relationship)
- **Multiple inheritance**: a class with more than one parent, which needs clear lookup rules
- **Polymorphism**: the same method call doing different things on different classes
- **MRO**: the Method Resolution Order Python follows to find a method; see it with `Class.mro()`

**Part 2 - Deck of cards** ([`deck.py`](deck.py))

| Part | What it does |
|---|---|
| `Card` | A frozen dataclass with `suit` and `value` that rejects invalid ones and prints like `A of Spades` |
| `Deck.shuffle()` | Rebuilds all 52 cards and shuffles them |
| `Deck.deal()` | Takes one card, or raises `IndexError` when the deck is empty |
| `Deck.deal_many(n)` | Takes `n` cards, checking that `n` is not negative or bigger than what is left |
| `len(deck)` / `iter(deck)` | Count and loop over the remaining cards |

## 🧠 What I learned

- `@dataclass(frozen=True)` makes a card that cannot be changed after it is created
- Building the deck with a list comprehension over suits and values gives all 52 cards in one line
- `__len__` and `__iter__` make my own class work with `len()` and `for` loops

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 2 Day 5 - Mini-projects - Daily Challenge
