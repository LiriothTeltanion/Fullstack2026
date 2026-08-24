# Pre-consolidation structure baseline

> Evidence source: Git index/tree at `20f27a7a5fdd0d68a85f892438849d51d6ff82ba`, reconciled with the Windows working tree on 2026-08-24.
>
> Status: **VERIFIED historical pre-consolidation snapshot.** For current paths, use [`CONSOLIDATION_RESULT.md`](CONSOLIDATION_RESULT.md) and [`../nova/tree.txt`](../nova/tree.txt).

## Root architecture

| Area | Role | Classification |
|---|---|---|
| `Week1Python` through `Week6DatabasesAndNodejs` | Course material organized by week/day/exercise | Source + learning documentation |
| `.github/` | Read-only CI and dependency update configuration | Configuration |
| `tests/python/` | Representative Python behavior and repository contracts | Tests |
| `tests/js/` | Representative Node/TypeScript syntax and repository contracts | Tests |
| `tools/` | NOVA audit, static gate, TypeScript syntax helper, Node test runner | Tooling |
| `assets/readme/` | Generated/local README visuals | Assets |
| `reports/nova/` | Historical/current NOVA-generated heuristics and catalogs | Generated reports |
| `reports/resume/` | Evidence-first recovery baseline and decision records | Current recovery reports |
| `.ai/` | Cross-agent stable context | Wave 1 source of truth |
| `.learning/` | Repository evidence and Kevin learning state | Wave 1 source of truth |

## Tracked classification at baseline

| Root | Source | Tests | Documentation | Config | Other |
|---|---:|---:|---:|---:|---:|
| `Week1Python` | 35 | 0 | 48 | 1 | 0 |
| `Week2OOP` | 34 | 2 | 45 | 0 | 2 |
| `Week3JavaScriptandDOM` | 67 | 0 | 79 | 0 | 9 |
| `Week4AdvAsynchronousJavaScript` | 29 | 0 | 36 | 0 | 0 |
| `Week5MiniProjectAndTypeScript` | 8 | 0 | 19 | 3 | 0 |
| `Week5MiniprojectAndTypeScript` | 3 | 0 | 3 | 3 | 0 |
| `Week6DatabasesAndNodejs` | 26 | 0 | 39 | 12 | 0 |

Repository-wide tracked classification: 207 source files, 14 files classified under test paths, 287 documentation files, 32 configuration files, 270 assets, 5 generated-report data files, and 16 other files. These are file classifications, not executed-test counts.

## Week, day, and exercise paths

### Week 1 — Python

- `Week1Python/Day1StartingwithPython`: `DailyChallenge/BuildUpAString`, `Exercises/ExercisesXP`, `Exercises/ExercisesXPGold`, `Exercises/ExercisesXPNinja`
- `Week1Python/Day2ListsIteratingAndFormattingData`: `DailyChallenge/GoldHappyBirthday`, `DailyChallenge/ListAndStrings`, `Exercises/ExercisesXP`, `Exercises/ExercisesXPGold`, `Exercises/ExercisesXPNinja`
- `Week1Python/Day3Dictionaries`: `DailyChallenge/CaesarCypher`, `DailyChallenge/Dictionaries`, `Exercises/ExercisesXP`, `Exercises/ExercisesXPGold`, `Exercises/ExercisesXPNinja`, `Exercises/ExercisesXPPlus`, `Exercises/TimedChallenge1`, `Exercises/TimedChallenge2`
- `Week1Python/Day4Functions`: `DailyChallenge/SolveTheMatrix`, `Exercises/ExercisesXP`, `Exercises/ExercisesXPGold`, `Exercises/ExercisesXPNinja`, `Exercises/TimedChallenge1`
- `Week1Python/Day5MiniProject`: `DailyChallenge/AdvancedAlgorithm`, `DailyChallenge/Challenges`, `Exercises/Challenges1`, `Exercises/Challenges2`, `Exercises/Hangman`, `Exercises/TicTacToe`

### Week 2 — OOP

- `Week2OOP/Day1IntroductiontoOOP`: direct Daily Challenge material plus `Exercises/ExercisesXP`, `Exercises/ExercisesXPGold`, `Exercises/ExercisesXPNinja`
- `Week2OOP/Day2OOPInheritanceEncapsulationPolymorphism`: `DailyChallenge/Pagination`, `Exercises/ExercisesXP`, `Exercises/ExercisesXPGold`, `Exercises/ExercisesXPNinja`
- `Week2OOP/Day3OOPandModules`: `DailyChallenge/Circle`, `DailyChallenge/Translator`, `DailyChallenge/UserInfo`, `Exercises/ExercisesXP`, `Exercises/ExercisesXPGold`, `Exercises/ExercisesXPNinja`
- `Week2OOP/Day4PythonFileIOJSONandAPI`: `DailyChallenge/TextAnalysis`, `Exercises/ExercisesXP`, `Exercises/ExercisesXPGold`, `Exercises/ExercisesXPNinja`
- `Week2OOP/Day5MiniProject`: `DailyChallenge/Modules`, `DailyChallenge/OOPQuiz`, `Exercises/AnagramChecker`, `Exercises/RockPaperScissors`, `Exercises/WeatherApp`
- `Week2OOP/RemoteLearningOOP`: `DailyChallenge/AirManagement`, `Exercises/MiniProjectVaccines`

### Week 3 — JavaScript and DOM

- `Week3JavaScriptandDOM/Day1IntroductiontoJavaScript`: `DailyChallenge/BubbleSort`, `DailyChallenge/DailyChallengeNotBad`, `DailyChallenge/DailyChallengeStars`, `Exercises/ExercisesXP`, `Exercises/ExercisesXPGold`, `Exercises/ExercisesXPNinja`
- `Week3JavaScriptandDOM/Day2FunctionsandDOMIntroduction`: `DailyChallenge/DailyChallengePlanets`, `DailyChallenge/WordsInTheStars`, `Exercises/ExercisesXP`, `Exercises/ExercisesXPGold`, `Exercises/ExercisesXPNinja`
- `Week3JavaScriptandDOM/Day3LearningDOMEvents`: `DailyChallenge/Letters`, `DailyChallenge/TellTheStory`, `Exercises/ExercisesXP`, `Exercises/ExercisesXPAnimations`, `Exercises/ExercisesXPGold`, `Exercises/ExercisesXPNinja`, `Exercises/MiniProjectCreateaSignInForm`
- `Week3JavaScriptandDOM/Day4AdvancedJavaScriptFunctions`: `DailyChallenge/Groceries`, `Exercises/ExercisesXP`, `Exercises/ExercisesXPGold`, `Exercises/ExercisesXPNinja`
- `Week3JavaScriptandDOM/Day5MiniProject`: `DailyChallenge/TodoList`, `Exercises/drumset-mini`, `Exercises/MiniProjectColoringGame`
- `Week3JavaScriptandDOM/RemoteLearningJSAndDOM`: `Exercises/ExercisesXP1`, `Exercises/ExercisesXP2`

### Week 4 — Advanced/asynchronous JavaScript

- `Week4AdvAsynchronousJavaScript/Day1AdvancedArrayMethods`: `DailyChallenge/CarInventory`, `DailyChallenge/GoWildcats`, `Exercises/ExercisesXP`, `Exercises/ExercisesXPGold`, `Exercises/ExercisesXPGold2`
- `Week4AdvAsynchronousJavaScript/Day2AdvancedObjectMethods`: direct Daily Challenge material plus `Exercises/ExercisesXP`
- `Week4AdvAsynchronousJavaScript/Day3HTTPAndFormMethodGETAndPOST`: `DailyChallenge/HTMLForm`, `DailyChallenge/TrueOrFalse`, `Exercises/ExercisesXP`, `Exercises/ExercisesXPGold`, `Exercises/RandomQuoteGenerator`
- `Week4AdvAsynchronousJavaScript/Day3HTTPandFormmethodGETandPOST`: legacy case variant containing three unique `DailyChallenge/TrueOrFalse` assets in the Git index
- `Week4AdvAsynchronousJavaScript/Day4AsynchronousJavaScript`: `DailyChallenge/PlayWithWords`, `Exercises/ExercisesXP`
- `Week4AdvAsynchronousJavaScript/Day5FetchAndAsyncAwait`: `Exercises/ExercisesXP`

### Week 5 — Mini projects and TypeScript

- Canonical `Week5MiniProjectAndTypeScript/Day1MiniProject`: `DailyChallenge/CurrencyConverter`; its `Exercises` wrapper is split from legacy Pokédex/Star Wars paths in the Git index
- Canonical `Week5MiniProjectAndTypeScript/Day2IntroductionToTypeScriptAndKeyConcepts`: `DailyChallenge/UnionTypeValidator` documentation plus `Exercises/ExercisesXP`
- Canonical `Week5MiniProjectAndTypeScript/Day3AdvancedTypeScriptConceptsAndApplications`: direct Daily Challenge material plus `Exercises/ExercisesXP`
- Canonical `Week5MiniProjectAndTypeScript/Day4AdvancedTypeScriptConceptsAndApplications`: direct Daily Challenge material, `Exercises/ExercisesXP`, `Exercises/ExercisesXPGold`
- Legacy `Week5MiniprojectAndTypeScript/Day1Miniproject`: `Exercises/Pokedex`, `StarWarsWebApp`
- Legacy `Week5MiniprojectAndTypeScript/Day2IntroductionToTypeScriptAndKeyConcepts`: the executable/configuration portion of `DailyChallenge/UnionTypeValidator`

### Week 6 — Databases and Node.js

- `Week6DatabasesAndNodejs/Day1IntroductionToDatabases`: `Exercises/ExercisesXP`, `Exercises/ExercisesXPGold`, `Exercises/ExercisesXPPlus`
- `Week6DatabasesAndNodejs/Day2DatabaseConcepts1`: `Exercises/ExercisesXP`
- `Week6DatabasesAndNodejs/Day3DatabaseConcepts2`: `Exercises/ExercisesXP`, `Exercises/ExercisesXPGold`
- `Week6DatabasesAndNodejs/Day4NodejsIntroduction`: `DailyChallenge/NodejsAppAndNPM`, `Exercises/ExercisesXP` with seven nested Node exercise packages/projects

## Case-insensitive collisions

The index has no file-path collision where two tracked files map to the same full case-folded path. It has **10 directory collision groups**, all descendants of two structural collisions:

1. Week 4 Day 3 canonical/legacy directory, including `DailyChallenge` and `TrueOrFalse` descendants (3 groups).
2. Week 5 canonical/legacy root, including Day 1, Day 2, `Exercises`, `DailyChallenge`, `UnionTypeValidator`, and `src` descendants (7 groups).

Windows presents each group as one physical directory. Therefore filesystem-only scans falsely imply that consolidation already happened. `DUPLICATE_ANALYSIS.csv` inventories the 65 tracked blobs and the exact 12 legacy-to-canonical moves.

## Nested package and runtime boundaries

- Root npm tooling: `/package.json` + `/package-lock.json`.
- Strict TypeScript package: `Week5MiniProjectAndTypeScript/Day2IntroductionToTypeScriptAndKeyConcepts/DailyChallenge/UnionTypeValidator/` (`package.json`, `tsconfig.json`; split across case variants before Wave 1).
- Python dependency declaration: `Week2OOP/Day5MiniProject/DailyChallenge/Modules/requirements.txt`.
- Node package boundaries under Week 6: the daily challenge plus seven exercise package directories. None has a committed nested lockfile.
- There is no root `tsconfig.json`; root TypeScript validation is syntax transpilation only.

## Suspicious wrappers and generated material

- Ninety-six tracked directories contain only direct `README.md`/`.gitignore` files while delegating source to descendants; most are intentional navigation wrappers generated by NOVA.
- Two apparent leaf wrappers are artifacts of the split Git paths: Week 5 `Day1MiniProject/Exercises` and Union Type Validator `src`. Both gain their unique source files after consolidation.
- `reports/nova/` contains generated and dated material. Its 92% readiness is historical and must not be treated as course mastery.
- `assets/readme/progress/` contains many deterministic status assets, but their scores inherit repository heuristics rather than learning evidence.

## Cross-platform path risks

- Case-only directory variants are unsafe on Windows and coexist on case-sensitive CI.
- `tools/nova_ultimate.py` previously performed filesystem case moves without proving Git-index consolidation; whole-directory case moves must not be reused for this recovery.
- Generated catalogs contain stale `Day1Miniproject`, `DailyChallange`, and `ExercicesXPGold` paths and require path repair.
- The Week 6 `Nodejs` spelling is retained in Wave 1 to avoid an unrelated broad cosmetic rename.
