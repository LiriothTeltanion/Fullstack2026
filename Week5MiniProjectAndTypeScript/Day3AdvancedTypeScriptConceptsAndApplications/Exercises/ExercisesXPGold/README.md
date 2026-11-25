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
