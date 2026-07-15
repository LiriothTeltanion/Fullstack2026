# ExercisesXP — Advanced TypeScript (Single File)

<!-- NOVA:ULTIMATE:START -->
<div align="center">

<img src="../../../../assets/readme/nova-folder-pulse.svg" width="100%" alt="Animated NOVA learning pulse">

### Exercises XP

<img src="../../../../assets/readme/progress/exercises-xp-fbf0813a52.svg" width="100%" alt="Readiness status for Exercises XP">

**Goal:** Use TypeScript types, interfaces, classes, unions, and guards to make domain logic safer.

</div>

## 🧭 NOVA Folder Guide

| Metric | Value |
|---|---:|
| Readiness | **80%** |
| Files | 4 |
| Source files | 1 |
| Test files | 0 |
| Text lines | 128 |

### ▶️ Main paths

- `Week5MiniProjectAndTypeScript/Day4AdvancedTypeScriptConceptsAndApplications/Exercises/ExercisesXP/ExercisesXP.ts`

### 🚀 Run

```bash
npx tsx Week5MiniProjectAndTypeScript/Day4AdvancedTypeScriptConceptsAndApplications/Exercises/ExercisesXP/ExercisesXP.ts
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

Single TypeScript file containing solutions for exercises 1–7:
- Intersection Types
- Type Guards (union types)
- Type Casting / Type Assertions
- Generic Constraints
- Intersection + Type Guards (Employee)
- Assertions + Generic Constraints

## File
- `ExercisesXP.ts` — all solutions + quick console tests.

## Requirements
- Node.js 18+

## Run with ts-node
```bash
npx ts-node ExercisesXP.ts
```

## Compile and run with tsc
```bash
npx tsc ExercisesXP.ts
node ExercisesXP.js
```

## Notes
Type assertions (e.g., `value as string`) do not convert values at runtime. For real conversion use `String(value)` or `value.toString()`.

---

## 📜 License

This exercise follows the repository-wide MIT terms; see the [LICENSE](../../../../LICENSE) file for details.
