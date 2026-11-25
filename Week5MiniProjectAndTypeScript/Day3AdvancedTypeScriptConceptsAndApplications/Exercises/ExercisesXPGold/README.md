# 🥇 Exercises XP Gold

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xp-gold-e7ef168aba.svg" width="100%" alt="Progress card for Exercises XP Gold">

</div>

Object-oriented TypeScript in [ExercisesXPGold.ts](ExercisesXPGold.ts): an abstract base class, access modifiers, an interface and a generic class.

## ▶️ How to run

```bash
node ExercisesXPGold.ts
npx tsc --strict --noEmit ExercisesXPGold.ts
```

```
1-2. #1 Alice (Engineer) earns 12600
1-2. #2 Bob (Engineer) earns 11000
1-2. #3 Carol (Manager) earns 16000
3. Sorted versions: 0.9, 1.2, 1.10
4. Employees created: 3
5. Back from: contact | now on: about | size: 2
```

## 🎯 The challenge

| Exercise | What it does |
|---|---|
| 1. `abstract class Employee` | Has `readonly id`, a `protected baseSalary`, an abstract `monthlyPay()` and a shared `describe()` |
| 2. `Engineer`, `Manager` | Each subclass pays differently: overtime at 60 per hour, or 500 per team member |
| 3. `Version implements Comparable<Version>` | `compareTo()` compares major, then minor, so `1.10` sorts after `1.2` |
| 4. `private static count` | Counts every employee created; read through the static getter `Employee.total` |
| 5. `Stack<T>` | `push`, `pop`, `peek` and a `size` getter over a private array |

I wrote the fields out in full instead of using constructor parameter properties, because Node's type stripping can only remove types, not rewrite code.

## 🧠 What I learned

- An abstract class can't be created with `new`, but it can hold code all the children share
- `protected` lets `Engineer` use `baseSalary` while code outside the classes can't
- Comparing versions as text would put `1.10` before `1.2`; turning the parts into numbers fixes that
- `addToTeam()` returns `this`, so the calls chain

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 5 Day 3 - Advanced TypeScript Concepts and Applications - Exercises XP Gold


## 🧩 Focused class examples

The examples in [ClassExamples.ts](ClassExamples.ts) exercise the exported classes in [CourseClasses.ts](CourseClasses.ts).

| Example | Behavior |
| --- | --- |
| Employee and Manager | Protected name and salary support shared details. A manager adds its public department and overrides the details method. |
| Car | The make and model are readonly. The model is private, while the public year can change. |
| MathUtils | A static PI constant powers circumference calculations. Negative and non-finite radii raise RangeError. |
| Addition and Multiplication | Both classes implement the same two-number Operation contract. |
| ColoredRectangle | A Shape can expose area; a Rectangle adds readonly dimensions and perimeter. Zero-length dimensions are accepted, and negative or non-finite dimensions are rejected. |

Run from this folder using Node 24 or newer and the repository's installed TypeScript compiler.

```bash
node ClassExamples.ts
node --test ClassExamples.test.ts
npx --no-install tsc --strict --types node --target es2022 --module nodenext --allowImportingTsExtensions --noEmit CourseClasses.ts ClassExamples.ts ClassContracts.ts ClassExamples.test.ts ExercisesXPGold.ts
```

The example prints a manager in Engineering, the updated `2025 Toyota Yaris`, circumference `12.56636`, operation results `7` and `12`, and rectangle area/perimeter `12` and `14`.

[ClassContracts.ts](ClassContracts.ts) holds seven statements with expected compiler errors for protected access, private access and readonly assignment. Its exported function is for compile-time checking and stays uncalled. TypeScript's readonly and private keywords enforce these rules during type checking. JavaScript runtime reflection can still access ordinary properties after type stripping.

The earlier [Version example](ExercisesXPGold.ts) accepts exactly `major.minor`, with two non-negative safe integers and no surrounding whitespace. It rejects missing, malformed, overflowing or unsafe parts with RangeError. Version ordering retains the existing `0.9, 1.2, 1.10` result. The regression suite tests those boundaries alongside the class examples.

Built with AI-assisted tooling; I reviewed, tested and can explain every change.
