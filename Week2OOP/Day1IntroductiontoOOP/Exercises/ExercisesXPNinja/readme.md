# Exercises XP Ninja — Single-File Solution 🧠🐍

<!-- NOVA:ULTIMATE:START -->
<div align="center">

<img src="../../../../assets/readme/nova-folder-pulse.svg" width="100%" alt="Animated NOVA learning pulse">

### Exercises XPNinja

<img src="../../../../assets/readme/progress/exercises-xpninja-6ee560a90f.svg" width="100%" alt="Readiness status for Exercises XPNinja">

**Goal:** Extend the lesson with advanced algorithmic and creative problem-solving challenges.

</div>

## 🧭 NOVA Folder Guide

| Metric | Value |
|---|---:|
| Readiness | **80%** |
| Files | 3 |
| Source files | 1 |
| Test files | 0 |
| Text lines | 166 |

### ▶️ Main paths

- `Week2OOP/Day1IntroductiontoOOP/Exercises/ExercisesXPNinja/exercisesxpninja.py`

### 🚀 Run

```bash
python Week2OOP/Day1IntroductiontoOOP/Exercises/ExercisesXPNinja/exercisesxpninja.py
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

Everything is in **one Python file**: `exercisesxpninja.py` + this `readme.md`.  
Comments and docstrings are in **English**. Emojis included where useful. ✨

## What’s inside
- ☎️ **Phone** — call history and simple messaging
  - `call(other_phone)` — prints and records who called whom
  - `show_call_history()` — prints the local call history
  - `send_message(other_phone, content)` — stores a message dict on both phones (`to`, `from`, `content`)
  - `show_outgoing_messages()` — lists messages sent by this phone
  - `show_incoming_messages()` — lists messages received by this phone
  - `show_messages_from(other_phone)` — lists incoming messages from a specific phone

## How to run
```bash
python exercisesxpninja.py   # runs a small demo
```

## Quick import example
```python
from exercisesxpninja import Phone

a = Phone("+972-50-111-2222")
b = Phone("+972-52-333-4444")

a.call(b)
a.send_message(b, "Hi!")
b.send_message(a, "Hello back!")

a.show_incoming_messages()
b.show_messages_from(a)
```
Enjoy! 💙
