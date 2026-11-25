# 🥇 Exercises XP Gold 2

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xp-gold-2-b20c74ca42.svg" width="100%" alt="Progress card for Exercises XP Gold 2">

</div>

A second Gold set: a calculator, a shopping list and a light/dark switch where the state lives in the parent.

## ▶️ How to run

```bash
npm install
npm run dev
```

Open the address Vite prints (usually http://localhost:5173).

## 🎯 The challenge

1. **Calculator** (`Calculator.jsx`): two number inputs, an operation `<select>` (+, −, ×, ÷) and an `=` button. The operations live in an object of small functions, dividing by 0 shows "Cannot divide by 0", and an empty field asks to fill in both numbers.
2. **Shopping list** (`ShoppingList.jsx`): add items, tick them as bought (they get crossed out), remove them with ✕, and read how many are left.
3. **Theme toggle** (`ThemeToggle.jsx` + `App.jsx`): `App` owns the `theme` state and passes `theme` and `onToggle` down. The button only asks for the change, and the `<main>` class switches between `light` and `dark`.

## 🧠 What I learned

- Inputs give strings, so I keep strings in state and call `Number()` only when calculating
- An object of operations (`operations[operator]` called with `a` and `b`) replaces a `switch` with four cases
- `filter()` for removing and `map()` for toggling keep the list immutable
- Lifting state up means the child stays simple and the parent decides what the theme does to the page

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 7 Day 5 - React Components and State - Exercises XP Gold 2
