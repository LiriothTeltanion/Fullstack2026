# 🥇 Exercises XP Gold

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/week8-day3-exercises-xp-gold-0d372418b4.svg" width="100%" alt="Progress card for Exercises XP Gold">

</div>

A shopping cart that combines `useReducer` with `useContext`, plus two custom hooks I can reuse later: `useLocalStorage` and `usePrevious`.

## ▶️ How to run

```bash
npm ci
npm run dev
```

Vite prints a local address (usually `http://localhost:5173`); I open it in the browser.

Use Node `^22.13.0 || >=24`. The exercise pins Vite 7.3.8 and the React plugin
4.7.0 in its lockfile while retaining React 18.3.1 compatibility.

## 🎯 The challenge

1. **Shopping cart**: `CartProvider` runs `cartReducer` with three actions. `add` raises the quantity if the product is already there, `decrease` removes it at zero and `clear` empties the cart. `ProductList` and `Cart` both read the cart with `useCart()`, and the total in ₪ is calculated in the provider.
2. **useLocalStorage**: works like `useState` but reads the first value from `localStorage` and attempts to save every change. `NoteSaver` uses it, and a successful write survives a reload.
3. **usePrevious**: stores the last value in a ref after each render. `PreviousValue` shows "Now" and "Before" for a counter.

## 🧠 What I learned

- Context plus a reducer works like a tiny store that any component under the provider can use
- Passing a function to `useState` reads `localStorage` only once, on the first render
- A ref keeps a value between renders without starting a new render when it changes
- Wrapping storage in `try/catch` keeps the app working when the browser blocks it

## 💾 Note storage

If a write fails, the note stays editable in memory and its status explains that it was not saved. Editing again after storage becomes writable retries the save and clears the warning on success. Malformed JSON or a stored value that is not text falls back to an empty note. The optional validator leaves other useLocalStorage callers free to store generic JSON values.

To check recovery, save a note and reload, block writes and edit it, then restore writes and edit again. The failed edit must show the in-memory message, preserve the previous saved value and remain editable. The successful retry must restore saved feedback and survive a reload.

The textarea keeps its desktop width and fits narrow screens. Storage failures
are local browser conditions; there is no remote save service or account.

## 🧪 Reproducible browser tests

From this exercise folder, install and build the app, then install the isolated
test dependencies and Chromium:

```bash
npm ci
npm run build
npm ci --prefix tests
cd tests
npx playwright install chromium
npm test
```

After that setup, `npm test` from the exercise folder runs the same suite. The
seven browser tests open the production build on an ephemeral loopback port.
They cover successful storage and reloads, quota/security failures, preservation
of the last saved note, retry after recovery, initially denied storage, malformed
and non-text saved data, and the original shopping-cart/previous-value demos.
A separately built fixture checks the generic hook with objects, arrays, null and
functional setters. The warning is checked at desktop, 390 px and 320 px. External
requests are blocked; every note is synthetic and each test gets a fresh browser
context. No existing browser profile or notes are read.

`PW_CHANNEL=msedge` is an optional Playwright browser override when Microsoft Edge
is installed. The default is the Chromium installed by the command above. The
tests use normal package resolution and do not depend on a machine-specific
module path. See [test details](tests/README.md).

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 8 Day 3 - React Advanced Hooks - Exercises XP Gold

Built with AI-assisted tooling; I reviewed, tested and can explain every change.
