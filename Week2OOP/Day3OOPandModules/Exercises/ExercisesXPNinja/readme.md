# Exercises XP Ninja — Dunder Methods 🧠🪄

<!-- NOVA:ULTIMATE:START -->
<div align="center">

<img src="../../../../assets/readme/nova-folder-pulse.svg" width="100%" alt="Animated NOVA learning pulse">

### Exercises XPNinja

<img src="../../../../assets/readme/progress/exercises-xpninja-efd1a61847.svg" width="100%" alt="Readiness status for Exercises XPNinja">

**Goal:** Extend the lesson with advanced algorithmic and creative problem-solving challenges.

</div>

## 🧭 NOVA Folder Guide

| Metric | Value |
|---|---:|
| Readiness | **80%** |
| Files | 3 |
| Source files | 1 |
| Test files | 0 |
| Text lines | 332 |

### ▶️ Main paths

- `Week2OOP/Day3OOPandModules/Exercises/ExercisesXPNinja/exercisesxpninjadunder.py`

### 🚀 Run

```bash
python Week2OOP/Day3OOPandModules/Exercises/ExercisesXPNinja/exercisesxpninjadunder.py
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

Everything in **one Python file**: `exercisesxpninjadunder.py` + this `readme.md`.  
Comments and docstrings in **English**. Emojis included. ✨

## Exercise 1 — Temperature
- Canonical storage in Kelvin for a **single source of truth**.
- Subclasses: `Celsius`, `Kelvin`, `Fahrenheit`.
- Clean conversions and **dunder methods**:
  - Ordering (`<, ==`) via Kelvin
  - `__add__/__sub__` with numeric deltas (Kelvin)
  - `t1 - t2` returns delta (Kelvin, float)
  - `__str__/__repr__` give readable forms
- Design maps well to **SOLID** guidelines and is open for new scales.

## Exercise 2 — Quantum Realm
- `QuantumParticle(x, p, label=None)` with measurement methods:
  - `position()` → int [1..10000]
  - `momentum()` → float [0..1)
  - `spin()` → ±1/2 (stored as ±0.5)
- Every measurement triggers a disturbance of `(x, p)` and prints **"Quantum Interferences!!"**.
- `entangle(other)` links two particles so a spin measurement sets opposite spins; prints **"Spooky Action at a Distance !!"**.
- `__repr__` shows label, x, p, spin, and entanglement status.

## Run
```bash
python exercisesxpninjadunder.py
```
The `__main__` block runs short demos for both exercises.
