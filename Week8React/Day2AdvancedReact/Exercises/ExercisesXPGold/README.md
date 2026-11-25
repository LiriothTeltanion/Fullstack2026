# 🥇 Exercises XP Gold

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/week8-day2-exercises-xp-gold-1da1db5b93.svg" width="100%" alt="Progress card for Exercises XP Gold">

</div>

The class component lifecycle, step by step, and then the same color example rewritten with hooks to compare.

## ▶️ How to run

```bash
npm install
npm run dev
```

Vite prints a local address (usually `http://localhost:5173`); I open it in the browser.

The lifecycle messages go to the browser console.

## 🎯 The challenge

1. **Lifecycle methods**: `FavoriteColor` starts red, and `componentDidMount` switches it to yellow after one second. `shouldComponentUpdate` blocks re-renders while the "Allow updates" box is unchecked, `getSnapshotBeforeUpdate` returns the old color and `componentDidUpdate` logs the change.
2. **Unmounting**: the "Delete" button removes `Child`, and its `componentWillUnmount` shows an alert before it disappears.
3. **The same with hooks**: `ColorWithHooks` does the timer with `useEffect(..., [])` and a cleanup, and logs each change with a second effect that depends on `favoriteColor`.

## 🧠 What I learned

- `componentDidMount` runs once after the first render, like an effect with an empty array
- Returning `false` from `shouldComponentUpdate` skips the render even when the state changed
- The value returned by `getSnapshotBeforeUpdate` arrives as the third argument of `componentDidUpdate`
- Clearing the timer on unmount avoids setting state on a component that is gone

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 8 Day 2 - Advanced React - Exercises XP Gold
