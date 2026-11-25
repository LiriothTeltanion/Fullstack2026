# Daily Challenge GOLD: Bubble Sort

**What you will learn**
- Use array methods and loops to solve a sorting algorithm
- Use nested for loops

---

## Instructions Implemented

Given:
```js
const numbers = [5,0,9,1,7,4,2,6,3,8];
```

1. Convert the array to a string using `.toString()`.
2. Convert the array to a string using `.join()` with different separators: `"+"`, a space, and an empty string.
3. Sort the array in **descending** order using **nested for loops**, without using any built-in sort method (Bubble Sort).
   - Use a temporary variable to swap values.
   - Log each step so the process is clear.

---

## Run

```bash
node index.js
```

You should see:
- The string results from `toString()` and `join()`.
- Bubble Sort steps (per pass and per comparison), and the final sorted array.

**Expected final result**
```
[9,8,7,6,5,4,3,2,1,0]
```
