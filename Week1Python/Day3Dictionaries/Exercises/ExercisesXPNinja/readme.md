# Exercises XP Ninja — Cars 🚗🧠

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
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 1 Day 3 - Exercises XP Ninja

---

*Happy coding!* 🐍✨
