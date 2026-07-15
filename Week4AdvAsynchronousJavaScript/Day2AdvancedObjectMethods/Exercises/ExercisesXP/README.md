# Objects, Destructuring & Classes — Exercises XP (TypeScript) 🧠🧩

<!-- NOVA:ULTIMATE:START -->
<div align="center">

<img src="../../../../assets/readme/nova-folder-pulse.svg" width="100%" alt="Animated NOVA learning pulse">

### Exercises XP

<img src="../../../../assets/readme/progress/exercises-xp-1913cdd331.svg" width="100%" alt="Readiness status for Exercises XP">

**Goal:** Build resilient asynchronous flows with HTTP requests, loading states, validation, and error handling.

</div>

## 🧭 NOVA Folder Guide

| Metric | Value |
|---|---:|
| Readiness | **80%** |
| Files | 3 |
| Source files | 1 |
| Test files | 0 |
| Text lines | 167 |

### ▶️ Main paths

- `Week4AdvAsynchronousJavaScript/Day2AdvancedObjectMethods/Exercises/ExercisesXP/ObjectsDestructuringClassesXP.ts`

### 🚀 Run

```bash
npx tsx Week4AdvAsynchronousJavaScript/Day2AdvancedObjectMethods/Exercises/ExercisesXP/ObjectsDestructuringClassesXP.ts
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

Practice **object destructuring**, **object/array methods**, and **classes with inheritance**.

## ✅ What’s inside
- 1️⃣ Location destructuring → formatted string with lat/lng
- 2️⃣ `displayStudentInfo({first,last})` → "Your full name is ..."
- 3️⃣ Users to entries (and IDs ×2) using `Object.entries` + `map`
- 4️⃣ `Person` class; `typeof new Person('John')` → `"object"`
- 5️⃣ `Dog` → `Labrador` (correct constructor uses `super(name)` then sets fields)
- 6️⃣ Equality & references + `Animal`/`Mammal` with `sound()` → “Moooo I'm a cow, named Lily and I'm brown and white”

## 📂 Files
- `ObjectsDestructuringClassesXP.ts` — all solutions with a small demo block (guarded).

## ▶️ Run locally
```bash
# Using ts-node
npx ts-node ObjectsDestructuringClassesXP.ts

# Or compile to JS and run
npx tsc ObjectsDestructuringClassesXP.ts
node ObjectsDestructuringClassesXP.js
```

## 🧪 Expected snippets
```
I am John Doe from Vancouver, Canada. Latitude(49.2827), Longitude(-123.1207)
Your full name is Elie Schoppik
usersAsEntries: [ [ 'user1', 18273 ], [ 'user2', 92833 ], [ 'user3', 90315 ] ]
usersIdsTimesTwo: [ [ 'user1', 36546 ], [ 'user2', 185666 ], [ 'user3', 180630 ] ]
typeof member: object
eqArrays ([2] === [2]): false
eqObjects ({} === {}): false
vals: { val2: 4, val3: 4, val4: 5 }
Moooo I'm a cow, named Lily and I'm brown and white
```
