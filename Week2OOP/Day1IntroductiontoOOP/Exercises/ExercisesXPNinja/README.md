# 🥷 Exercises XP Ninja

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xpninja-6ee560a90f.svg" width="100%" alt="Progress card for Exercises XPNinja">

</div>

A `Phone` class in `exercisesxpninja.py` that can call other phones, keep a call history and send messages.

## ▶️ How to run

```bash
python exercisesxpninja.py
```

```text
+972-50-111-2222 called +972-52-333-4444
+972-52-333-4444 called +972-50-111-2222
Call history for +972-50-111-2222:
1. +972-50-111-2222 called +972-52-333-4444
...
```

## 🎯 The challenge

| Method | What it does |
|---|---|
| `call(other_phone)` | Prints and records who called whom |
| `show_call_history()` | Prints the numbered call history, or `No calls yet.` |
| `send_message(other_phone, content)` | Stores a message dict (`to`, `from`, `content`) on both phones |
| `show_outgoing_messages()` | Lists the messages this phone sent |
| `show_incoming_messages()` | Lists the messages this phone received |
| `show_messages_from(other_phone)` | Lists the incoming messages from one phone |

## 🧠 What I learned

- One object can call methods on another object it receives as an argument
- Saving a copy with `dict(msg)` keeps the two phones from sharing the same dictionary
- List comprehensions are a quick way to filter messages by sender or receiver

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 2 Day 1 - Introduction to Object-Oriented Programming - Exercises XP Ninja
