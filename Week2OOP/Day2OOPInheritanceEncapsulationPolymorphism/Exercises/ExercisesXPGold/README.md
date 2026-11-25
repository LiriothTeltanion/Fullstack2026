# 🥇 Exercises XP Gold

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xpgold-84145eca48.svg" width="100%" alt="Progress card for Exercises XPGold">

</div>

A small banking system in `exercisesxpgoldinheritance.py`: an account you have to log in to, a child account with a minimum balance, and an ATM menu on top.

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

That's a quick check with the `kevin` and `maya` accounts. The ATM is commented out so the script doesn't wait for input; uncomment `ATM([a, b], try_limit=3)` to use it.

## 🎯 The challenge

1. **BankAccount** - `authenticate(username, password)` sets `authenticated`. Before that, `deposit()` and `withdraw()` raise `PermissionError`, and the amount has to be a positive `int`. Taking out more than the balance raises `ValueError`, so the balance never goes negative
2. **MinimumBalanceAccount** - inherits from `BankAccount`, adds `minimum_balance` and overrides `withdraw()`. Taking 900 out of 1000 with a minimum of 200 raises `ValueError`, taking 700 works
3. **ATM** - checks the account list and `try_limit` (a bad value falls back to 2), then loops through a main menu, a login with limited tries and an account menu

## 🧠 What I learned

- To change the withdraw rule, the child class overrides one method and keeps everything else
- `PermissionError` and `ValueError` stop a bad action, while a `print` would let it go through
- In the ATM menu, `try / except` around `int(input())` turns a typo into an `Error:` line, not a crash

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 2 Day 2 - Inheritance, Encapsulation and Polymorphism - Exercises XP Gold
