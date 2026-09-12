# Week 1 / Day 1 Exercises XP verification

- Recorded: `2026-09-10T21:08:28+03:00` (`Asia/Jerusalem`)
- Target: `Week1Python/Day1StartingwithPython/Exercises/ExercisesXP/`
- Base revision: `origin/main` at `167c00835673`
- Repository evidence state: `verified` for the bounded behaviors listed below
- Learning state: `unknown` (`UNVERIFIED` until Kevin explains and reproduces the core logic)
- Platform submission state: `UNVERIFIED`
- Official requirement/source status: `VERIFIED` against the current Exercises XP text supplied by Kevin on 2026-09-10, carrying an October 30, 2025 update label

The authenticated course prompt is not reproduced in this public record. This file stores only the source-safe behavioral comparison and reproducible evidence.

## Requirement comparison

| Exercise | Result | Evidence and boundary |
|---|---|---|
| 1 — Hello World | `VERIFIED` | One `print(...)` call produces exactly four `Hello world` lines. |
| 2 — Some Math | `VERIFIED` | The implementation evaluates `(99**3) * 8` as `7762392`. Two stale README/docstring examples were corrected. |
| 3 — Predict the output | `VERIFIED` for runtime; `UNVERIFIED` for learning | Runtime produces `False`, `True`, `False`, `TypeError`, `False` in order. The repository cannot prove that Kevin predicted each result before running it. |
| 4 — Computer brand | `VERIFIED` | The `computer_brand` variable is interpolated into the requested sentence. |
| 5 — Personal information | `VERIFIED` structurally | The sentence includes the configured name, age, and shoe-size variables. The historical personal literals were preserved and are not treated as a current-profile claim. |
| 6 — A and B | `VERIFIED` | With the configured values, `a > b` and the function prints `Hello World`. |
| 7 — Odd or Even | `VERIFIED` | Positive, zero, and negative integer cases are covered; invalid input is retried. |
| 8 — Same name | `VERIFIED` | Matching is case-insensitive and ignores surrounding whitespace; both result branches are covered. |
| 9 — Roller coaster | `VERIFIED` after fix | “Over 145 cm” is enforced strictly: 144 needs 2 cm, 145 needs 1 cm, and 146 qualifies. |

## Commands and observed results

```powershell
py -3.12 tests\python\test_week1_day1_exercises_xp.py -v
```

- Before the source fix: expected regression signal — 10 tests ran, with only the 144 cm and 145 cm boundary subtests failing.
- After the source fix: `Ran 10 tests ... OK` under Python `3.12.10`.

```powershell
npm test
```

- `PASS`: 4 Node tests and 40 Python tests passed under the repository's configured default Python (`3.14.6`).
- A separate full-suite probe under Python `3.12.10` reached 22 passing tests and 2 import errors because that local interpreter lacks the Windows `tzdata` package. The focused XP suite itself passes on Python 3.12.

```powershell
npm run lint:baseline
npm run typecheck:anchor
python tools/nova_quality_gate.py --repo . --strict --no-write
npm run intake:check
```

- `PASS`: the documented ESLint baseline remains exactly 65 findings.
- `PASS`: the TypeScript anchor completed with no diagnostics.
- `PASS`: the strict no-write NOVA quality gate reported 0 errors and 0 warnings.
- `PASS`: the public-safe exercise intake queue validated.

```powershell
npm run lint
npm run format:check
```

- `KNOWN BASELINE`: raw ESLint reports the same 65 curriculum findings accepted by `lint:baseline`; none are in this Python XP module or its new test.
- `KNOWN BASELINE`: Prettier reports only `tools/verify_eslint_baseline.mjs`, an unchanged file outside this exercise slice.

## What this evidence proves

- The repository implementation now agrees with the supplied Exercises XP requirements for the nine bounded behaviors.
- The roller-coaster threshold has a regression test covering both sides of the exact boundary.
- The arithmetic result and height explanation agree across source, tests, and local assignment documentation.

## What this evidence does not prove

- Kevin's independent prediction, explanation, or ability to recreate the exercises without assistance.
- Octopus completion, grading, submission, or instructor acceptance.
- Alignment of XP Ninja or the Daily Challenge; those require their own current source-safe packets. XP Gold has a separate [2026-09-11 evidence record](2026-09-11-week1-day1-exercises-xp-gold.md).
- Resolution of the repository-wide ESLint and Prettier baselines.

## AI assistance disclosure

Codex compared the Kevin-supplied requirements with the existing student source, designed the unit tests, identified and repaired the Exercise 9 off-by-one boundary, corrected two documentation contradictions, and ran the commands recorded above. Kevin's historical solutions and personal literals were otherwise preserved.

## Next review

- Proposed date: `2026-09-11` (Kevin-controlled)
- Kevin checkpoint: explain why Python exponentiation uses `**`, predict the five comparison outcomes before execution, explain why 145 cm fails a strict “over 145 cm” condition, and reproduce one new odd/even case without reading the solution.
