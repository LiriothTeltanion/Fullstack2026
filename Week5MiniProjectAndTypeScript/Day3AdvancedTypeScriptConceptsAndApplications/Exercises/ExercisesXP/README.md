# 🥉 Exercises XP

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xp-2d5251840f.svg" width="100%" alt="Progress card for Exercises XP">

</div>

Five object-oriented TypeScript exercises in one file.

## ▶️ How to run

From this folder:

```bash
npx tsc ExercisesXP_OOP.ts --module commonjs --outDir ~/tmp-ts
node ~/tmp-ts/ExercisesXP_OOP.js
```

The demo block only runs as CommonJS (`require.main === module`), and inside this repository `.js` files are ES modules, so I compile it to a folder outside the repo first.

```
Employee: Ada Lovelace (Engineer)
Fido says: bark
Calc add: 15
Calc subtract: 5
User #101: Kevin Cusnir <kevin@example.com> | Membership: gold
```

## 🎯 The challenge

1. **`Employee`** — `private` name and salary, a `public` position and a `protected` department; `getEmployeeInfo()` reads the private name.
2. **`Product`** — a `readonly id`; assigning it again is a compile error. `getProductInfo()` formats the price with two decimals.
3. **`Animal` → `Dog`** — `Dog` overrides `makeSound()`.
4. **`Calculator`** — static `add` and `subtract`, called without an instance.
5. **`User` → `PremiumUser`** — an interface with a `readonly id` and an optional `membershipLevel`; `printUserDetails()` prints it.

## 🧠 What I learned

- `private` and `protected` are checked by the compiler, not at runtime
- `readonly` stops reassignment after the constructor
- Static methods belong to the class itself
- An interface can extend another and add optional fields

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 5 Day 3 - Advanced TypeScript Concepts and Applications - Exercises XP
