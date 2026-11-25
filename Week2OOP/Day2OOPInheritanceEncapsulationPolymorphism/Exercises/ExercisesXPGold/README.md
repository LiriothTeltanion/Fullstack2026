# 🥇 Exercises XP Gold

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xpgold-84145eca48.svg" width="100%" alt="Progress card for Exercises XPGold">

</div>

A bank account, a stricter child account and a small ATM menu, all in `exercisesxpgoldinheritance.py`.

## ▶️ How to run

```bash
python exercisesxpgoldinheritance.py
```

```text
Deposited 100. New balance: 600
Withdrew 50. New balance: 550
Expected error: Withdrawal denied: balance would drop below minimum (200).
Withdrew 700. New balance: 300
```

The interactive ATM is commented out so the script does not wait for input. Uncomment `ATM([a, b], try_limit=3)` at the bottom to try it.

## 🎯 The challenge

1. **BankAccount** - `authenticate(username, password)` sets `authenticated`; `deposit()` and `withdraw()` raise `PermissionError` before login and only accept positive whole numbers
2. **MinimumBalanceAccount** - inherits `BankAccount`, adds `minimum_balance` and overrides `withdraw()` so the balance never drops below it
3. **ATM** - checks the account list and `try_limit` (an invalid limit falls back to 2), then shows a menu: log in, deposit, withdraw, exit

## 🧠 What I learned

- Overriding one method in a child class is enough to change its rules
- Keeping the balance check inside the account class keeps the menu code simple
- Raising an error is better than printing a warning when an action is not allowed
- A `try / except` around `int(input())` stops a typo from crashing the ATM

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 2 Day 2 - Inheritance, Encapsulation and Polymorphism - Exercises XP Gold
