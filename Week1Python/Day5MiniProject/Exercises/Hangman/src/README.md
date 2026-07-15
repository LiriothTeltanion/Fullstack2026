# Src

<!-- NOVA:ULTIMATE:START -->
<div align="center">

<img src="../../../../../assets/readme/nova-folder-pulse.svg" width="100%" alt="Animated NOVA learning pulse">

### Src

<img src="../../../../../assets/readme/progress/src-66a533bc61.svg" width="100%" alt="Readiness status for Src">

**Goal:** Build and test a state-driven word game with input validation and reusable domain logic.

</div>

## 🧭 NOVA Folder Guide

| Metric | Value |
|---|---:|
| Readiness | **80%** |
| Files | 3 |
| Source files | 3 |
| Test files | 0 |
| Text lines | 194 |

### ▶️ Main paths

- `Week1Python/Day5MiniProject/Exercises/Hangman/src/art.py`
- `Week1Python/Day5MiniProject/Exercises/Hangman/src/game.py`
- `Week1Python/Day5MiniProject/Exercises/Hangman/src/words.py`

### 🚀 Run

```bash
python Week1Python/Day5MiniProject/Exercises/Hangman/src/art.py
python Week1Python/Day5MiniProject/Exercises/Hangman/src/game.py
python Week1Python/Day5MiniProject/Exercises/Hangman/src/words.py
```

### 🟢 What is already strong

- ✅ README documentation is generated and repeatable.
- ✅ Contains 3 source file(s) across practical exercises or projects.
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
