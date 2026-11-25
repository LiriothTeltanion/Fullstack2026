# 🥇 Exercises XP Gold

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xpgold-efcef6b89a.svg" width="100%" alt="Progress card for Exercises XPGold">

</div>

Five short exercises on nested arrow functions, closures, currying and function composition.

## ▶️ How to run

```bash
node index.js
```

```
Exercise 1: ____/''''\____
Exercise 2: 13
Exercise 3: 31
Exercise 4: 17
Exercise 5: 16
```

## 🎯 The challenge

1. **Nested functions** – `landscape()` rewritten with arrow functions: `flat(4)`, `mountain(4)`, `flat(4)` build `____/''''\____`.
2. **Closure** – `addTo(10)` returns a function that remembers 10, so `addToTen(3)` is 13.
3. **Currying** – `curriedSum(30)(1)` is 31.
4. **Currying again** – `add5 = curriedSum(5)`, so `add5(12)` is 17.
5. **Composing** – `compose(inc, plus5)(10)` runs `plus5` first, then `inc`: 16.

## 🧠 What I learned

- An inner arrow function can change a variable of the outer function
- A closure keeps the value it was created with
- Currying turns `f(a, b)` into `f(a)(b)`, which makes partial functions like `add5` easy
- `compose(f, g)` reads right to left: `g` runs first

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 3 Day 4 - Advanced JavaScript Functions - Exercises XP Gold
