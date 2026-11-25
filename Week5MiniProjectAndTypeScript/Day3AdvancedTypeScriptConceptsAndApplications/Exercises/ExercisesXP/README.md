# 🥉 Exercises XP

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xp-2d5251840f.svg" width="100%" alt="Progress card for Exercises XP">

</div>

`ExercisesXP_OOP.ts` holds five short class and interface exercises, with a demo at the end.

## ▶️ How to run

From this folder:

```bash
npx tsc ExercisesXP_OOP.ts --module commonjs --outDir ~/tmp-ts
node ~/tmp-ts/ExercisesXP_OOP.js
```

The demo is guarded by `require.main === module`, so it needs CommonJS output. Since `.js` files in this repo are ES modules, the compiled file goes to a folder outside it.

```
Employee: Ada Lovelace (Engineer)
Fido says: bark
Calc add: 15
Calc subtract: 5
User #101: Kevin Cusnir <kevin@example.com> | Membership: gold
```

## 🎯 The challenge

1. **`Employee`**: `private` name and salary, a `public` position and a `protected` department. `getEmployeeInfo()` uses the private name inside the class. The salary is stored but nothing reads it yet.
2. **`Product`**: `readonly id`, so a second assignment is a compile error. `getProductInfo()` prints the price with two decimals (the demo doesn't call it).
3. **`Animal` → `Dog`**: `Dog` overrides `makeSound()` with the `override` keyword and returns `bark`.
4. **`Calculator`**: static `add` and `subtract`, called as `Calculator.add(10, 5)` with no instance.
5. **`User` → `PremiumUser`**: `User` has a `readonly id`; `PremiumUser` adds an optional `membershipLevel` limited to `"silver" | "gold" | "platinum"`. `printUserDetails()` adds the level only when it is set.

## 🧠 What I learned

- Reading `emp.name` from outside is a compile error, but the compiled JavaScript would still allow it
- `readonly` can be set once in the constructor and never again
- `override` makes the compiler confirm that the parent really has that method
- A string literal union is a quick way to limit a field to a few allowed values

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 5 Day 3 - Advanced TypeScript Concepts and Applications - Exercises XP
