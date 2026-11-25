# 🧪 Exercise 1 - CommonJS Products

<div align="center">

<img src="../../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../../assets/readme/progress/exercise-1-commonjs-products-8faee08461.svg" width="100%" alt="Progress card for Exercise 1 commonjs products">

</div>

A small product catalog exported with CommonJS, and a function that finds a product by its name.

## ▶️ How to run

```bash
node shop.js
```

```
✅ Found: Mechanical Keyboard — $99 [Peripherals]
✅ Found: USB-C Hub — $39 [Accessories]
❌ Not found: Unknown
```

## 🎯 The challenge

| File | What it does |
|---|---|
| `products.js` | Exports an array of five products (`name`, `price`, `category`) with `module.exports` |
| `shop.js` | Loads it with `require("./products")`. `findProductByName(name)` trims the name, compares it without caring about upper or lower case and returns the product or `null`; an empty name prints a warning. The file searches for three names as a demo. |

## 🧠 What I learned

- `module.exports` decides what another file gets back from `require()`
- `Array.prototype.find()` returns the first match, or `undefined` when there is none
- Comparing with `toLowerCase()` makes the search case-insensitive
- A guard clause handles empty input before the real work

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 6 Day 4 - Introduction to Node.js - Exercise 1
