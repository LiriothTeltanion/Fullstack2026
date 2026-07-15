# TypeGuardUnion — Daily Challenge: Type Guard with Union Types

<!-- NOVA:ULTIMATE:START -->
<div align="center">

<img src="../../../assets/readme/nova-folder-pulse.svg" width="100%" alt="Animated NOVA learning pulse">

### Daily Challenge

<img src="../../../assets/readme/progress/daily-challenge-dd0d57f83c.svg" width="100%" alt="Readiness status for Daily Challenge">

**Goal:** Use TypeScript types, interfaces, classes, unions, and guards to make domain logic safer.

</div>

## 🧭 NOVA Folder Guide

| Metric | Value |
|---|---:|
| Readiness | **80%** |
| Files | 4 |
| Source files | 1 |
| Test files | 0 |
| Text lines | 110 |

### ▶️ Main paths

- `Week5MiniProjectAndTypeScript/Day4AdvancedTypeScriptConceptsAndApplications/DailyChallenge/TypeGuardUnion.ts`

### 🚀 Run

```bash
npx tsx Week5MiniProjectAndTypeScript/Day4AdvancedTypeScriptConceptsAndApplications/DailyChallenge/TypeGuardUnion.ts
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

Single-file TypeScript solution demonstrating discriminated unions and custom type guards.

## File
- `TypeGuardUnion.ts` — types (`User | Product | Order`), guard predicates, and `handleData` implementation with graceful fallback.

## Requirements
- Node.js 18+

## Run with ts-node
```bash
npx ts-node TypeGuardUnion.ts
```

## Compile and run with tsc
```bash
npx tsc TypeGuardUnion.ts
node TypeGuardUnion.js
```

## Notes
- Uses discriminated unions via the `type` field and predicate functions (`isUser`, `isProduct`, `isOrder`).
- `handleData` returns an array of messages and handles unexpected cases by returning a descriptive string instead of throwing.

---

## 📜 License

This exercise follows the repository-wide MIT terms; see the [LICENSE](../../../LICENSE) file for details.
