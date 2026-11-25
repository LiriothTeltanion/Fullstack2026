# 🥉 Exercises XP

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xp-20e9111fdc.svg" width="100%" alt="Progress card for Exercises XP">

</div>

Eight exercises on scope, the ternary operator, template strings, arrow functions, self-invoking functions and nested functions. They all live on one page.

## ▶️ How to run

Open `index_advanced_js.html` in a browser (or use `npm run dev` from the repo root). The fortune and the navbar fill in on load. The buttons show my scope predictions, run the small functions and make the juice.

```
The client wants a large juice, containing orange, ginger, spinach, apple, lemon, mint.
```

## 🎯 The challenge

1. **Scope**: five snippets, each with my prediction in a comment. I commented out the `alert` calls so the page doesn't pop up five times. `scopeSummary()` lists the answers on the page, one per line.
2. **Ternary**: `winBattle` as an arrow function and `experiencePoints = winBattle() ? 10 : 1`.
3. **Is it a string?**: `isString(val)` returns `true` only for strings.
4. **Find the sum**: the one-line arrow `add(x, y)`.
5. **Kg and grams**: the same conversion written three ways (declaration, expression, one-line arrow), with a comment on hoisting.
6. **Fortune teller**: a self-invoking function writes `You will be a Developer in Reykjavik, and married to Alex with 2 kids.`
7. **Welcome**: another self-invoking function puts `Kevin` and the initial `K` in the navbar.
8. **Juice Bar**: `makeJuiceV1()` logs one sentence. `makeJuice()` collects 6 ingredients in an array its inner functions share and writes the final sentence.

More notes are in [README_Advanced_JS.md](README_Advanced_JS.md).

## 🧠 What I learned

- An inner `let a4` hides the outer `a4` inside its block, and the outer value comes back after it
- Trying to reassign a `const` throws a `TypeError`, which is what #1.2 and #2.2 predict
- A function declaration can be called before its line, but a `const` function expression can't
- `addIngredients` and `displayJuice` both reach the `ingredients` array of `makeJuice`

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 3 Day 4 - Advanced JavaScript Functions - Exercises XP
