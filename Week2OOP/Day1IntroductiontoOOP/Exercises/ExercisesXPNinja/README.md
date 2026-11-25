# 🥷 Exercises XP Ninja

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xpninja-6ee560a90f.svg" width="100%" alt="Progress card for Exercises XPNinja">

</div>

Two `Phone` objects talking to each other. The class in `exercisesxpninja.py` makes calls, keeps a call history and sends text messages.

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
| `call(other_phone)` | Prints `X called Y` and saves it in the caller's history |
| `show_call_history()` | Numbered list of calls, or `No calls yet.` |
| `send_message(other_phone, content)` | Builds a dict with `to`, `from` and `content` and stores it on both phones |
| `show_outgoing_messages()` | Messages where this phone is the sender |
| `show_incoming_messages()` | Messages where this phone is the receiver |
| `show_messages_from(other_phone)` | Incoming messages from one specific number |

Only the caller remembers a call. The phone that receives it doesn't get an entry in its own history.

## 🧠 What I learned

- A method can take another object as a parameter and read or change that object's data
- The receiver gets `dict(msg)`, a copy, so editing one phone's message can't change the other's
- One `messages` list is enough, because filtering on `from` or `to` splits it into outgoing and incoming

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 2 Day 1 - Introduction to Object-Oriented Programming - Exercises XP Ninja
