# Exercises XP Gold — Inheritance 🧠🧬

<!-- NOVA:ULTIMATE:START -->
<div align="center">

<img src="../../../../assets/readme/nova-folder-pulse.svg" width="100%" alt="Animated NOVA learning pulse">

### Exercises XPGold

<img src="../../../../assets/readme/progress/exercises-xpgold-84145eca48.svg" width="100%" alt="Readiness status for Exercises XPGold">

**Goal:** Reinforce the lesson with intermediate scenarios, validation, and stronger edge-case handling.

</div>

## 🧭 NOVA Folder Guide

| Metric | Value |
|---|---:|
| Readiness | **80%** |
| Files | 3 |
| Source files | 1 |
| Test files | 0 |
| Text lines | 279 |

### ▶️ Main paths

- `Week2OOP/Day2OOPInheritanceEncapsulationPolymorphism/Exercises/ExercisesXPGold/exercisesxpgoldinheritance.py`

### 🚀 Run

```bash
python Week2OOP/Day2OOPInheritanceEncapsulationPolymorphism/Exercises/ExercisesXPGold/exercisesxpgoldinheritance.py
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

All code is in **one Python file**: `exercisesxpgoldinheritance.py` + this `readme.md`.  
Docstrings and comments in **English**. Emojis included. ✨

## Contents
- 🏦 **BankAccount**
  - `authenticate(username, password)` sets `authenticated=True` on match
  - `deposit(amount:int)` / `withdraw(amount:int)` require `authenticated=True`
- 📉 **MinimumBalanceAccount (inherits BankAccount)**
  - `minimum_balance` in `__init__`
  - `withdraw` only allowed if `balance - amount >= minimum_balance`
- 🏧 **ATM**
  - Validates `account_list` and `try_limit` (falls back to 2 on invalid input)
  - `show_main_menu()` → Login / Exit
  - `log_in(username, password)` loops until success or `try_limit`
  - `show_account_menu(account)` → Deposit / Withdraw / Exit

## Run
```bash
python exercisesxpgoldinheritance.py
```
By default, the ATM demo is **commented out** to avoid blocking.  
Uncomment the `ATM([a, b], try_limit=3)` line at the bottom to try the interactive menu.

## Example accounts (for ATM)
- `username=kevin`, `password=1234`, balance=500
- `username=nova`,  `password=blue`, balance=1000, minimum_balance=200

## Quick import
```python
from exercisesxpgoldinheritance import BankAccount, MinimumBalanceAccount, ATM

a = BankAccount(500, "kevin", "1234")
b = MinimumBalanceAccount(1000, "nova", "blue", minimum_balance=200)
a.authenticate("kevin", "1234"); a.deposit(100); a.withdraw(50)
b.authenticate("nova", "blue"); b.withdraw(700)
```
Enjoy! 💙
