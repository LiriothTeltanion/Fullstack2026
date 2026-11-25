# 🥉 Exercises XP

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xp-fbf0813a52.svg" width="100%" alt="Progress card for Exercises XP">

</div>

Seven advanced TypeScript exercises in one file, each with a quick console test.

## ▶️ How to run

From this folder (Node 22.18 or newer runs TypeScript files directly):

```bash
node ExercisesXP.ts
```

```
E1: { name: 'Kevin', age: 30, street: 'Herzl 1', city: 'Beersheba' }
E2 number: This is a number
E3 casted (static): 12345
E3 safeString (runtime): 12345
E4 ["x", 2]: x
Length is: 10
E6 Ada: Ada (age 34) manages the R&D department.
E7 number: «123.45»
```

## 🎯 The challenge

| Function | What it does |
|---|---|
| `PersonWithAddress` | Exercise 1: `Person & Address` combines two types |
| `describeValue(v)` | Exercise 2: a `typeof` guard on `number \| string` |
| `casted` / `safeString` | Exercise 3: `as string` changes only the type; `String(value)` really converts |
| `getFirstElement(arr)` | Exercise 4: returns the first item of a mixed array as a string |
| `logLength(arg)` | Exercise 5: works for anything with a `length` |
| `describeEmployee(e)` | Exercise 6: `Person & Job`, with a sentence that depends on the position |
| `formatInput(input)` | Exercise 7: anything with `toString()`, wrapped in « » |

## 🧠 What I learned

- An intersection type needs every property of both types
- A type assertion does not change the value at runtime
- `T extends { length: number }` lets a generic accept strings and arrays alike

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 5 Day 4 - Advanced TypeScript Concepts and Applications - Exercises XP
