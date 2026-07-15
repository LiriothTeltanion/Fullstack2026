# ExercisesXP OOP — TypeScript (Single File)

<!-- NOVA:ULTIMATE:START -->
<div align="center">

<img src="../../../../assets/readme/nova-folder-pulse.svg" width="100%" alt="Animated NOVA learning pulse">

### Exercises XP

<img src="../../../../assets/readme/progress/exercises-xp-2d5251840f.svg" width="100%" alt="Readiness status for Exercises XP">

**Goal:** Use TypeScript types, interfaces, classes, unions, and guards to make domain logic safer.

</div>

## 🧭 NOVA Folder Guide

| Metric | Value |
|---|---:|
| Readiness | **80%** |
| Files | 3 |
| Source files | 1 |
| Test files | 0 |
| Text lines | 163 |

### ▶️ Main paths

- `Week5MiniProjectAndTypeScript/Day3AdvancedTypeScriptConceptsAndApplications/Exercises/ExercisesXP/ExercisesXP_OOP.ts`

### 🚀 Run

```bash
npx tsx Week5MiniProjectAndTypeScript/Day3AdvancedTypeScriptConceptsAndApplications/Exercises/ExercisesXP/ExercisesXP_OOP.ts
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

Single-file solution for the OOP-focused Exercises XP (1–5): access modifiers, readonly, inheritance, static methods, and interfaces (with optional/readonly fields).

## Files
- `ExercisesXP_OOP.ts` — all solutions and a small demo guarded so it won't run when imported by a grader.

## How to run locally
```bash
# with ts-node
npx ts-node ExercisesXP_OOP.ts

# or compile and run JS
npx tsc ExercisesXP_OOP.ts
node ExercisesXP_OOP.js
```

## Submission note
If your autograder evaluates every file in the folder, place **only** `ExercisesXP_OOP.ts` in the assignment directory to avoid false negatives on non-TS files.
