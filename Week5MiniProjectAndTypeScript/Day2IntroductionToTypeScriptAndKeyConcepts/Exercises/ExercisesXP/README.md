# 🥉 Exercises XP

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xp-01b16c7b23.svg" width="100%" alt="Progress card for Exercises XP">

</div>

All nine exercises sit in `ExercisesXP_Basics.ts`: typed constants, a union, `if...else`, a tuple, an object type, a DOM type assertion, a `switch` and an overloaded function.

## ▶️ How to run

From this folder:

```bash
npx tsc ExercisesXP_Basics.ts --module commonjs --outDir ~/tmp-ts
node ~/tmp-ts/ExercisesXP_Basics.js
```

The demo at the bottom only runs as CommonJS (`require.main === module`). Inside this repository `.js` files are treated as ES modules, so I compile to a folder outside the repo first.

```
Hello, World!
Age: 30 | Name: Kevin
describeNumberSign(-3): negative
Details tuple: [ 'Alice', 25, 'Hello, Alice! You are 25 years old.' ]
editor -> Edit content
greet("Kevin"): Hello, Kevin!
```

## 🎯 The challenge

| Function | What it does |
|---|---|
| `describeNumberSign(n)` | Returns `positive`, `negative` or `zero` |
| `getDetails(name, age)` | Returns the tuple `[string, number, string]`, the last item a greeting |
| `createPerson(name, age)` | Builds an object of type `Person` |
| `setInputValueById(id, value)` | Treats the element as an `HTMLInputElement` and sets its value; outside a browser it just returns |
| `getAction(role)` | Trims and lowercases the role, then a `switch` with grouped cases (`admin`/`owner`/`superuser`, `editor`/`author`/`contributor`, …) returns the action or `Invalid role` |
| `greet()` / `greet(name)` | Two overload signatures, one body; with no name it says `Hello, there!` |

Exercises 1 to 3 are just typed constants: `helloMessage`, `age` and `fullName`, and `id` typed as `string | number`.

## 🧠 What I learned

- The types are only for the compiler; the `.js` that `tsc` writes has none of them
- A tuple return type pins both the length and the type of each slot
- `as HTMLInputElement` is a promise I make to the compiler, so I still check that the element exists
- Stacking `case` labels with no `return` between them lets several roles share one answer
- With overloads, callers see the clean signatures and one implementation with `name?` does the work

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 5 Day 2 - TypeScript Fundamentals and Key Concepts - Exercises XP
