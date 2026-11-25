# 🥉 Exercises XP

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/week8-day1-exercises-xp-86643213df.svg" width="100%" alt="Progress card for Exercises XP">

</div>

Three class-component exercises demonstrate error boundaries, updates and unmounting. The earlier component examples remain available under Earlier component demos.

## ▶️ How to run

```bash
npm install
npm run dev
```

Vite prints a local address (usually `http://localhost:5173`); I open it in the browser.

## Assignment alignment · 2026-11-25

1. BuggyCounter throws during render at five. ErrorBoundary uses componentDidCatch and a detailed fallback. One boundary surrounds two counters, then each counter gets its own boundary. The unbounded case opens a separate HTML page/root.
2. FavoriteColor starts red, changes to yellow after a two-second mount timer and to blue through its button. shouldComponentUpdate returns true, componentDidUpdate records after update, and unmounting clears the timer.
3. UnmountDemo starts with show=true. Delete removes the Child header, and Child.componentWillUnmount notifies with alert.

Run npm test for five React renderer regression tests and npm run build for both HTML entries. This entry uses ordinary rendering so development StrictMode's simulated unmount does not trigger the teaching alert on page load. The isolated unbounded page intentionally shows an uncaught render error.

## Earlier component demos

The original Car/Garage, Events, Phone and useEffect examples are preserved in the expandable section. The notes below describe that earlier version.

## 🎯 Earlier exercise outline

1. **Car and Garage**: `Car` gets `carInfo` as a prop, keeps its `color` in state and renders a `Garage` with `size="small"`, which prints "Who lives in my small Garage?".
2. **Events**: in `Events.jsx` a button writes "I was clicked", an input reacts only to the Enter key and shows what I typed, and a third button flips between `ON` and `OFF`.
3. **Phone and its state**: `Phone` keeps brand, model, color and year in one object; "Change color" copies it with the spread operator and sets the color to blue.
4. **useEffect**: `Color` starts with `favoriteColor = "red"`, and every time the color changes the effect adds a line to a small log under the button.

## 🧠 What I learned

- Props flow down from `App` to `Car` to `Garage`, and each component only sees what it receives
- `onKeyDown` gives me `event.key`, so checking for `"Enter"` is one `if`
- Updating an object in state means `{ ...phone, color: "blue" }`, never changing `phone.color` directly
- The earlier entry used development `StrictMode`, which ran effects twice on mount; the current lifecycle entry uses ordinary rendering

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 8 Day 1 - Multiple Components and Events - Exercises XP
