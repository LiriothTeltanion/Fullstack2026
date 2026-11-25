# 🥇 Exercises XP Gold

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xpgold-933866d3e0.svg" width="100%" alt="Progress card for Exercises XPGold">

</div>

Five harder TypeScript exercises in one file: guards on an intersection type, generic casting, and two generic classes.

## ▶️ How to run

From this folder (Node 22.18 or newer runs TypeScript files directly):

```bash
node ExercisesXPGold.ts
```

```
E1 name: Alice
E1 adminLevel: 3
E1 missing: undefined
E2 number: 123.45
E2 boolean: true
E3 len [1,2,3]: 3
E4 boxStr[1]: y
E5 qStr remove: { value: 'alpha' }
E5 qStr peek: { value: 'beta' }
```

## 🎯 The challenge

| Part | What it does |
|---|---|
| `getProperty(obj, prop)` | Exercise 1: reads a property of an `AdminUser` (`User & Admin`), or `undefined` |
| `castToType(value, ctor)` | Exercise 2: a real runtime conversion through a function like `Number` |
| `getArrayLength(items)` | Exercise 3: accepts only number or string arrays |
| `Box<T>` | Exercise 4: a class that implements a generic `Storage<T>` interface |
| `Queue<T>` | Exercise 5: `add`, `remove`, `peek`, `length` and `isEmpty` for items of type `Item<T>` |

## 🧠 What I learned

- "Casting" in TypeScript is only an assertion, so real conversion needs a function
- A class can implement a generic interface for any type
- Constraints on `T` stop wrong types at compile time

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 5 Day 4 - Advanced TypeScript Concepts and Applications - Exercises XP Gold
