# 🥉 Exercises XP

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xp-01b16c7b23.svg" width="100%" alt="Progress card for Exercises XP">

</div>

Nine beginner TypeScript exercises in one file: annotations, unions, `if...else`, tuples, object types, a DOM type assertion, `switch` and overloads.

## ▶️ How to run

From this folder:

```bash
npx tsc ExercisesXP_Basics.ts --module commonjs --outDir ~/tmp-ts
node ~/tmp-ts/ExercisesXP_Basics.js
```

The demo block only runs as CommonJS (`require.main === module`), and inside this repository `.js` files are ES modules, so I compile it to a folder outside the repo first.

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
| `getDetails(name, age)` | Returns a tuple `[string, number, string]` with a greeting |
| `createPerson(name, age)` | Returns an object of type `Person` |
| `setInputValueById(id, value)` | Asserts the element is an `HTMLInputElement` and sets its value; does nothing outside a browser |
| `getAction(role)` | A `switch` that maps `admin`, `editor`, `viewer` and `guest` to an action, or `Invalid role` |
| `greet()` / `greet(name)` | Two overload signatures with one implementation; the default is `there` |

Exercises 1 to 3 are typed constants: a message, `age` and `fullName`, and an `id` of type `string | number`.

## 🧠 What I learned

- TypeScript checks types while compiling; the JavaScript that runs has none
- A tuple fixes both the length and the type of each position
- `as HTMLInputElement` only tells the compiler what I expect, it checks nothing at runtime
- Overload signatures describe the calls; one body handles them all

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 5 Day 2 - TypeScript Fundamentals and Key Concepts - Exercises XP
