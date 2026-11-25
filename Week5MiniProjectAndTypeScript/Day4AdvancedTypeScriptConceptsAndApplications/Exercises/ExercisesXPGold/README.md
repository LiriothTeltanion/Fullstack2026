# ExercisesXPGold — Advanced TypeScript (Single File)

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xpgold-933866d3e0.svg" width="100%" alt="Progress card for Exercises XPGold">

</div>

Solutions for Exercises XP Gold (1–5) in a single TypeScript file with quick console tests.

## File
- `ExercisesXPGold.ts` — all exercises and tests.

## Requirements
- Node.js 18+

## Run with ts-node
```bash
npx ts-node ExercisesXPGold.ts
```

## Compile and run with tsc
```bash
npx tsc ExercisesXPGold.ts
node ExercisesXPGold.js
```

## Notes
- Type assertions (e.g., `value as string`) do not convert values at runtime. For real conversion, use `String(value)` or `value.toString()`.
- Exercise 2 uses a constructor/mapper function to perform a real runtime conversion in a generic way.

---

## 📜 License

This exercise follows the repository-wide MIT terms; see the [LICENSE](../../../../LICENSE) file for details.
