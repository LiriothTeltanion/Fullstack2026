# 🐾 Day 2 Exercises – Inheritance, Encapsulation & Polymorphism

<!-- NOVA:ULTIMATE:START -->
<div align="center">

<img src="../../../../assets/readme/nova-folder-pulse.svg" width="100%" alt="Animated NOVA learning pulse">

### Exercises XP

<img src="../../../../assets/readme/progress/exercises-xp-f1817611e4.svg" width="100%" alt="Readiness status for Exercises XP">

**Goal:** Complete the standard exercises required to master the lesson's core concepts.

</div>

## 🧭 NOVA Folder Guide

| Metric | Value |
|---|---:|
| Readiness | **80%** |
| Files | 3 |
| Source files | 1 |
| Test files | 0 |
| Text lines | 209 |

### ▶️ Main paths

- `Week2OOP/Day2OOPInheritanceEncapsulationPolymorphism/Exercises/ExercisesXP/exercisesxp.py`

### 🚀 Run

```bash
python Week2OOP/Day2OOPInheritanceEncapsulationPolymorphism/Exercises/ExercisesXP/exercisesxp.py
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

## 🎯 Learning Goals
- Understand how inheritance lets subclasses (like `Bengal` or `PetDog`) reuse and extend parent behaviour.
- Practice encapsulating behaviour inside classes such as `Pets`, `Dog`, and `Family`.
- Apply polymorphism by interacting with different subclasses through shared interfaces (e.g., calling `walk()` on any cat).
- Gain confidence running small OOP programs from the command line.

---

## 🧪 Exercise Overview
The `exercisesxp.py` script contains four progressive mini-exercises:

1. **Cat Walking Club**
   - Create a list of cat instances (`Bengal`, `Chartreux`, `Siamese`) that all inherit from `Cat`.
   - Pass the list to the `Pets` wrapper class and call `walk()` to demonstrate polymorphism.

2. **Dog Showdown**
   - Work with the `Dog` class to make dogs bark, calculate their running speed, and compete using the `fight()` method.

3. **Pet Dog Upgrade**
   - Extend `Dog` with the `PetDog` subclass that adds training, play sessions with other dogs, and random tricks when trained.

4. **Family Roster**
   - Use `Person` and `Family` classes to add members, present the family, and check whether individuals are adults.

Each section is executed sequentially when you run the script, printing example output to the console so you can confirm the behaviour.

---

## ▶️ How to Run the Exercises
1. Open a terminal in this directory.
2. Execute:
   ```bash
   python exercisesxp.py
   ```
3. Observe the printed walkthrough for cats, dogs, pet tricks, and the family roster.

> ℹ️ Feel free to modify or extend the classes and re-run the script to experiment with different animals or family members.

---

## ✅ What You Should Be Able to Do Afterwards
- Explain how inheritance helps avoid duplicating logic between similar classes.
- Recognise when to wrap related objects inside a helper class (like `Pets`).
- Design subclasses that add new behaviour while respecting the parent API.
- Build small interactive demos to validate your object-oriented designs.
