# 🥇 Exercises XP Gold 2

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xpgold2-0a6e7b392d.svg" width="100%" alt="Progress card for Exercises XPGold2">

</div>

Five short array and string exercises in one TypeScript file.

## ▶️ How to run

From this folder:

```bash
npx tsc ArraysMethodsXPGold.ts --module commonjs --outDir ~/tmp-ts
node ~/tmp-ts/ArraysMethodsXPGold.js
```

The demo block only runs as CommonJS (`require.main === module`), and inside this repository `.js` files are ES modules, so I compile it to a folder outside the repo first.

```
E1 sumArray([1,2,3,4]): 10
E2 uniqueArray: [ 1, 2, 3, 4, 5 ]
E3 cleanArray(sample): [ 15, -22, 47 ]
E4 repeat('Ha!', 3): Ha!Ha!Ha!
     ||<- Start line
       🐢
       🐇
turtleAfterPad: 🐢=======
```

## 🎯 The challenge

| Function | What it does |
|---|---|
| `sumArray(nums)` | Adds all the numbers with `reduce` |
| `uniqueArray(arr)` | Removes duplicates with `new Set` |
| `cleanArray(arr)` | Drops `null`, `0`, `""`, `false`, `undefined` and `NaN` |
| `repeat(str, n = 1)` | Repeats a string with a loop instead of `String.prototype.repeat` |
| `alignRacers()` | Lines the turtle and rabbit up under the start line with `padStart(9)` and shows what `trim().padEnd(9, "=")` does |

## 🧠 What I learned

- `Array.from(new Set(arr))` is the shortest way to remove duplicates
- `NaN` needs `Number.isNaN`, because `NaN === NaN` is false
- An emoji takes two UTF-16 code units, which changes how `padStart` counts

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 4 Day 1 - Advanced Array Methods - Exercises XP Gold 2
