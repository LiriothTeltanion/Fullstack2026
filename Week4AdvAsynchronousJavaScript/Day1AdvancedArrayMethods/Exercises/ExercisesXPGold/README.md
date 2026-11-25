# 🥇 Exercises XP Gold

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xpgold-dfd74631c0.svg" width="100%" alt="Progress card for Exercises XPGold">

</div>

Array analysis and destructuring in one TypeScript file: what `map` and `reduce` return, the `index` argument of `map`, nested arrays and a deeply trapped number.

## ▶️ How to run

From this folder:

```bash
npx tsc ArraysDestructuringXPGold.ts --module commonjs --outDir ~/tmp-ts
node ~/tmp-ts/ArraysDestructuringXPGold.js
```

The demo block only runs as CommonJS (`require.main === module`), and inside this repository `.js` files are ES modules, so I compile it to a folder outside the repo first.

```
Ex1 analyzeMapOutput: [ 2, 4, 6 ]
Ex2 analyzeReduceOutput: [ 1, 2, 0, 1, 2, 3 ]
Ex3 indicesObserved: [ 0, 1, 2, 3, 4, 5 ]
Ex4 arrayFlattened: [ [ 1 ], [ 2 ], [ 3 ], [ 4 ], [ 5 ] ]
Ex4 arrayFlattenedOneLine: [ [ 1 ], [ 2 ], [ 3 ], [ 4 ], [ 5 ] ]
Ex4 greetingJoined: [ 'Hello young grasshopper!', 'you are', 'learning fast!' ]
Ex4 greetingSentence: Hello young grasshopper! you are learning fast!
Ex4 freed: [ 3 ]
```

## 🎯 The challenge

1. **Analyse `map`** — every item is a number, so `[1, 2, 3].map(...)` returns `[2, 4, 6]`.
2. **Analyse `reduce`** — starting from `[1, 2]` and concatenating `[0, 1]` and `[2, 3]` gives `[1, 2, 0, 1, 2, 3]`.
3. **The `i` argument** — it is the index, so for six items it goes from 0 to 5.
4. **Nested arrays** — flatten `[[1], [2], [3], [[[4]]], [[[5]]]]`, join the `greeting` words into sentences, and free the `3` from 26 levels of arrays with my recursive `deepFlatten()`.

The target for the nested array was `[1, 2, 3, [4], [5]]`. My `arrayFlattened` keeps every number in its own one-item array, so it does not match yet; `arrayNested.flat(2)` gives the target.

## 🧠 What I learned

- `map` always returns an array of the same length
- The second argument of `reduce` is the starting value
- `flat(depth)` removes exactly that many levels of nesting
- A small recursive function can flatten any depth

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 4 Day 1 - Advanced Array Methods - Exercises XP Gold
