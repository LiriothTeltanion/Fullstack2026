# 🌟 Daily Challenge Gold - Bubble Sort

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/bubble-sort-dc81cde00f.svg" width="100%" alt="Progress card for Bubble Sort">

</div>

Turn an array of numbers into strings, then sort it from largest to smallest with my own Bubble Sort, without `Array.prototype.sort`.

## ▶️ How to run

```bash
node index.js
```

```
toString(): 5,0,9,1,7,4,2,6,3,8
join('+'): 5+0+9+1+7+4+2+6+3+8
...
Finished. Result: 9,8,7,6,5,4,3,2,1,0

Expected: [9,8,7,6,5,4,3,2,1,0]
Actual:   [9,8,7,6,5,4,3,2,1,0]
```

## 🎯 The challenge

Given `const numbers = [5,0,9,1,7,4,2,6,3,8];`:

1. Convert it with `.toString()`.
2. Convert it with `.join()` using `"+"`, a space and an empty string.
3. `bubbleSortDescending(input)` sorts a copy in descending order with two nested `for` loops. When the left number is smaller than the right one, a `temp` variable swaps them. Every pass and every comparison is logged.

If a pass makes no swap, the loop stops early because the array is already sorted.

## 🧠 What I learned

- `toString()` always uses commas, while `join()` lets me pick the separator
- Bubble Sort compares neighbours and pushes the smallest number to the end on each pass
- The inner loop can stop `pass` steps earlier, because the end of the array is already in place
- `slice()` gives me a copy, so the original `numbers` array is not changed

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 3 Day 1 - Introduction to JavaScript - Daily Challenge Gold
