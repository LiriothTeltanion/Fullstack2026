# 🥇 Exercises XP Gold

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xpgold-dfd74631c0.svg" width="100%" alt="Progress card for Exercises XPGold">

</div>

Four "what does this return?" exercises, written out in `ArraysDestructuringXPGold.ts`. The answers are exported constants, so the file both explains and proves each result.

## ▶️ How to run

From this folder:

```bash
npx tsc ArraysDestructuringXPGold.ts --module commonjs --outDir ~/tmp-ts
node ~/tmp-ts/ArraysDestructuringXPGold.js
```

I compile to `~/tmp-ts` on purpose. Inside the repo every `.js` file is treated as an ES module, and the demo only prints when `require.main === module`, a CommonJS thing.

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

1. **`map` analysis**: every item of `[1, 2, 3]` is a number, so the callback always doubles it and the result is `[2, 4, 6]`.
2. **`reduce` analysis**: the start value is `[1, 2]`, then `concat` adds `[0, 1]` and `[2, 3]`, giving `[1, 2, 0, 1, 2, 3]`.
3. **The `i` argument**: it is the index, so for the six items of `arrayNum` it runs from 0 to 5.
4. **Nested arrays**: flatten `[[1], [2], [3], [[[4]]], [[[5]]]]`, join the `greeting` words into one sentence, and free the `3` buried under 26 levels of brackets with my recursive `deepFlatten()`.

Part 4 is not finished. The target was `[1, 2, 3, [4], [5]]`, but both `arrayFlattened` and `arrayFlattenedOneLine` leave every number in its own one-item array. `arrayNested.flat(2)` would give the target in one call.

## 🧠 What I learned

- `map` never changes the length, even when the callback could return `undefined`
- In `reduce`, the second argument is the accumulator's first value, here a whole array
- `flat(n)` removes exactly `n` levels, so I need to count the brackets before picking `n`
- A function that calls itself on every inner array frees a value from any depth

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 4 Day 1 - Advanced Array Methods - Exercises XP Gold
