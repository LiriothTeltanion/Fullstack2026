# 🥉 Exercises XP

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xp-20e9111fdc.svg" width="100%" alt="Progress card for Exercises XP">

</div>

Eight exercises on scope, the ternary operator, template strings, arrow functions, self-invoking functions and nested functions, all on one page.

## ▶️ How to run

Open `index_advanced_js.html` in a browser (or use `npm run dev` from the repo root). The fortune and the navbar fill in on load; the buttons show the scope predictions, run the small functions and make the juice.

```
The client wants a large juice, containing orange, ginger, spinach, apple, lemon, mint.
```

## 🎯 The challenge

1. **Scope** – five snippets with my predictions in comments (the `alert` calls are commented out); `scopeSummary()` lists them on the page.
2. **Ternary** – `winBattle` as an arrow function and `experiencePoints = winBattle() ? 10 : 1`.
3. **Is it a string?** – `isString(val)` returns `true` only for strings.
4. **Find the sum** – the one-line arrow `add(x, y)`.
5. **Kg and grams** – the same conversion as a declaration, an expression and a one-line arrow, with a note on hoisting.
6. **Fortune teller** – a self-invoking function writes `You will be a Developer in Reykjavik, and married to Alex with 2 kids.`
7. **Welcome** – a self-invoking function puts `Kevin` and the initial `K` in the navbar.
8. **Juice Bar** – `makeJuiceV1()` logs one sentence; `makeJuice()` collects 6 ingredients in a closed-over array and writes the final sentence.

More notes are in [README_Advanced_JS.md](README_Advanced_JS.md).

## 🧠 What I learned

- `let` and `const` are block-scoped, and an inner variable can shadow an outer one
- Reassigning a `const` throws a `TypeError`
- Function declarations are hoisted with their body, function expressions are not
- An inner function can keep using the variables of the function around it

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 3 Day 4 - Advanced JavaScript Functions - Exercises XP
