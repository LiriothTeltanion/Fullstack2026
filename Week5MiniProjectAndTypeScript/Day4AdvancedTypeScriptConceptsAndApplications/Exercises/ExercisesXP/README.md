# ExercisesXP — Advanced TypeScript (Single File)

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xp-fbf0813a52.svg" width="100%" alt="Progress card for Exercises XP">

</div>

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
