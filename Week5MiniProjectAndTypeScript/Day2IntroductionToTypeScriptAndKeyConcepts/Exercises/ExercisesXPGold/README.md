# 🥇 Exercises XP Gold

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xp-gold-e8f20dfa16.svg" width="100%" alt="Progress card for Exercises XP Gold">

</div>

Five TypeScript basics in [ExercisesXPGold.ts](ExercisesXPGold.ts): parameters, unions, tuples, a type alias and literal types.

## 📚 Assignment-aligned functions

The earlier examples remain available as extra practice. The chapter-specific functions are in [requiredGold.ts](requiredGold.ts), with runnable calls in [requiredGold.examples.ts](requiredGold.examples.ts).

| Function or type                     | Behavior                                                            |
| ------------------------------------ | ------------------------------------------------------------------- |
| processValue                         | Formats a number as dollars with two decimals, or reverses a string |
| sumNumbersInArray                    | Adds finite numeric entries without converting strings              |
| AdvancedUser / introduceAdvancedUser | Required name and age, optional address, formatted introduction     |
| welcomeUser                          | Required name string and optional greeting defaulting to Hello      |

```bash
node requiredGold.examples.ts
node --test requiredGold.test.ts
npx tsc --strict --noEmit --target ES2022 --module nodenext --allowImportingTsExtensions --types node requiredGold.ts requiredGold.examples.ts requiredGold.test.ts
```

Run from this folder after installing the root development dependencies. Node 22.18+ runs these files directly. The separate type check verifies both accepted calls and expected compile-time rejections.

The focused tests cover mixed/empty arrays, negative/zero currency, Unicode surrogate pairs, optional address, default/custom greeting and invalid inputs. Non-finite numeric entries are ignored by the sum and rejected by currency formatting. Text reversal works by Unicode code point; it is not a grapheme-cluster normalizer.

## ▶️ How to run

Node 22.18 or newer runs the file directly by stripping the types. The type check is separate:

```bash
node ExercisesXPGold.ts
npx tsc --strict --noEmit ExercisesXPGold.ts
```

```
1. Hello, Kevin. | Shalom, Dana!
2. 3.14 yes HI
3. min 2 max 9
4. Playlist length: 17:59
   Albums: (single), (single), Sonder
5. red -> green -> yellow -> red
```

## 🎯 The challenge

| Exercise | What it does |
|---|---|
| 1. `greet(name, greeting = "Hello", punctuation?)` | A default and an optional parameter |
| 2. `formatValue(value: string \| number \| boolean)` | `typeof` checks narrow the union before each `return` |
| 3. `minMax(numbers)` | Returns a labelled tuple `[min: number, max: number]` that I destructure |
| 4. `Song` type | `readonly id` and an optional `album`; `totalTime()` adds up the seconds as `m:ss` |
| 5. `nextLight(light: TrafficLight)` | A `switch` over `"red" \| "yellow" \| "green"` with a `never` check in `default` |

## 🧠 What I learned

- After `if (typeof value === "number") return ...` TypeScript knows the rest of the function only sees strings and booleans
- The `never` line in the `switch` is a guard: adding a fourth colour to the type breaks the build until I handle it
- `album ?? "(single)"` handles the optional field without an `if`
- `export {}` at the end makes the file a module, so its names don't clash with the global ones from the DOM types

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 5 Day 2 - TypeScript Fundamentals and Key Concepts - Exercises XP Gold
