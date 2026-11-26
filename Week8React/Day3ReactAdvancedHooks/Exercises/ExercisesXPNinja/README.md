# 🥷 Exercises XP Ninja

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/week8-day3-exercises-xp-ninja-c316c82dc3.svg" width="100%" alt="Progress card for Exercises XP Ninja">

</div>

Three experiments with the performance hooks: `useMemo` around a heavy calculation, `React.memo` with and without `useCallback`, and a `useDebounce` hook for a search box.

## ▶️ How to run

```bash
npm install
npm run dev
```

Vite prints a local address (usually `http://localhost:5173`); I open it in the browser.

## 🎯 The challenge

1. **useMemo**: `PrimeFinder` runs `primesUpTo(limit)` (a sieve of Eratosthenes in `src/utils/primes.js`) inside `useMemo`. Changing the limit recalculates and shows the time; toggling the box color re-renders without recounting. With Node, `primesUpTo(20000)` returns 2262 primes and the last one is 19997.
2. **React.memo and useCallback**: two memoized `CounterButton`s count their own renders. Typing in the input re-renders the parent, and only the button whose `onClick` is not wrapped in `useCallback` renders again.
3. **useDebounce**: `useDebounce(value, 500)` returns the value only after it stops changing. `DebouncedSearch` counts its requests, so I can see one request per pause instead of one per key.

Try an empty, fractional or negative limit, then enter `10`. The prime finder keeps the input editable and reports four primes, ending in seven. In the search box, changing the query cancels the previous request. A failed request offers a retry with the same search text, while a successful empty result displays “No matching users.”

The browser regression checks use a local response fixture for the search service. From the repository root:

```sh
npm --prefix Week8React/Day3ReactAdvancedHooks/Exercises/ExercisesXPNinja install --no-package-lock
cd tests/browser/react-state
npm ci
npx playwright install chromium
npm test -- --config performance-hooks.config.js
```

## 🧠 What I learned

- `useMemo` only helps when the work is heavy and the dependencies change less often than the render
- `memo` compares props, and a new arrow function on every render counts as a new prop
- Debouncing is a timer that the effect cleanup cancels on every new keystroke
- Building the list with `push` instead of spreading a new array each time kept the sieve fast

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 8 Day 3 - React Advanced Hooks - Exercises XP Ninja
