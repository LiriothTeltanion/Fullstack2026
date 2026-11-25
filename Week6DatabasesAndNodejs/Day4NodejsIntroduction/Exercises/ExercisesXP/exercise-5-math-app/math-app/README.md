# 🧪 Exercise 5 - Math App

<div align="center">

<img src="../../../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../../../assets/readme/progress/math-app-06109cb6e4.svg" width="100%" alt="Progress card for Math app">

</div>

My own CommonJS module with `add` and `multiply`, used together with the `lodash` package.

## ▶️ How to run

```bash
npm install
node app.js
```

```
🧠 Unique numbers: 2, 3, 6
✅ Sum: 11
⚙️  Product: 36
```

## 🎯 The challenge

| Function | What it does |
|---|---|
| `add(a, b)` | Converts both values with `Number()` and adds them |
| `multiply(a, b)` | Converts both values with `Number()` and multiplies them |

`app.js` takes `[2, 2, 3, 3, 3, 6]`, removes the repeats with `_.uniq`, sorts them with `_.sortBy`, then uses `reduce` with my two helpers for the sum and the product.

## 🧪 Tests

From the repository root:

```bash
node --test tests/js/math_helpers.test.mjs
```

1 test loads `math.js` and checks that `add(2, 3)` is 5 and `multiply(4, 5)` is 20.

## 🧠 What I learned

- `npm install` reads `package.json` and downloads `lodash` into `node_modules`
- A local module is required with `./`, a package just by its name
- `_.uniq` removes duplicates and `_.sortBy` returns a sorted copy
- Small pure functions are easy to test

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 6 Day 4 - Introduction to Node.js - Exercise 5
