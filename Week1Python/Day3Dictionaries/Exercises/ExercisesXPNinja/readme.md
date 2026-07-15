# Exercises XP Ninja — Cars 🚗🧠

<!-- NOVA:ULTIMATE:START -->
<div align="center">

<img src="../../../../assets/readme/nova-folder-pulse.svg" width="100%" alt="Animated NOVA learning pulse">

### Exercises XPNinja

<img src="../../../../assets/readme/progress/exercises-xpninja-3644039a9f.svg" width="100%" alt="Readiness status for Exercises XPNinja">

**Goal:** Extend the lesson with advanced algorithmic and creative problem-solving challenges.

</div>

## 🧭 NOVA Folder Guide

| Metric | Value |
|---|---:|
| Readiness | **80%** |
| Files | 3 |
| Source files | 1 |
| Test files | 0 |
| Text lines | 153 |

### ▶️ Main paths

- `Week1Python/Day3Dictionaries/Exercises/ExercisesXPNinja/xpninjacars.py`

### 🚀 Run

```bash
python Week1Python/Day3Dictionaries/Exercises/ExercisesXPNinja/xpninjacars.py
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

Import-safe module with reusable helpers for the manufacturers exercise (lists, counting, and sorting).

## ✅ What it does
- Converts the canonical string of manufacturers into a clean list via `parse_manufacturers`.
- Reports totals, Z‑A ordering, and letter-based counts with pure functions (`sort_descending`, `count_with_letter`, `count_without_letter`).
- **Bonus**: removes duplicates while preserving order (`deduplicate_preserve_order`) and prints the list plus the new total.
- **Bonus**: prints the list in **ascending order (A‑Z)** with each name reversed using `ascending_reversed`.

## ▶️ How to run
```bash
python xpninjacars.py
```
Running the script calls a `_cli()` wrapper so importing the module elsewhere leaves the helpers quiet.

## 🧪 Expected output (summary)
```
Total manufacturers: 5
Descending (Z-A): ['Volkswagen', 'Toyota', 'Honda', 'Ford Motor', 'Chevrolet']
Manufacturers with letter 'o': 5
Manufacturers without letter 'i': 5
No-duplicate list: Honda, Volkswagen, Toyota, Ford Motor, Chevrolet
New total (no duplicates): 5
Ascending A-Z with reversed names: ['elegorhC', 'droM droF', 'adnoH', 'atoyoT', 'negaswolksoV']

## 🔍 Helper usage example

```python
from xpninjacars import (
	parse_manufacturers,
	sort_descending,
	count_with_letter,
	deduplicate_preserve_order,
)

manufacturers = parse_manufacturers("Volkswagen, Toyota, Ford Motor, Honda, Chevrolet")
sort_descending(manufacturers)
# -> ['Volkswagen', 'Toyota', 'Honda', 'Ford Motor', 'Chevrolet']
count_with_letter(manufacturers, "o")
# -> 5
deduplicate_preserve_order([
	"Honda", "Volkswagen", "Toyota", "Ford Motor", "Honda", "Chevrolet", "Toyota"
])
# -> ['Honda', 'Volkswagen', 'Toyota', 'Ford Motor', 'Chevrolet']
```
```
---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/Lirioth/Fullstack2026)  
Week 1 Day 3 - Exercises XP Ninja

---

*Happy coding!* 🐍✨
