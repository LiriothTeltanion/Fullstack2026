# 🥇 Exercises XP Gold

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xp-gold-27760a2713.svg" width="100%" alt="Progress card for Exercises XP Gold">

</div>

Three bigger TypeScript patterns in one small app: a reducer with a discriminated union of actions, a typed theme context, and a generic `useLocalStorage<T>` hook.

## ▶️ How to run

```bash
npm install
npm run dev
```

## 🎯 The challenge

1. **Typed `useReducer`.** `shoppingReducer` takes an `Action` union (`added`, `toggled`, `removed`, `clearedBought`). A `never` check in `default` makes the compiler complain if a case is missing. The list is loaded lazily with `useReducer(shoppingReducer, [], loadItems)` and saved on every change.
2. **Typed context.** `ThemeContext` is `createContext<ThemeContextValue | null>(null)`, and `useTheme()` throws when it is used outside `<ThemeProvider>`, so callers never deal with `null`.
3. **Generic hook.** `useLocalStorage<T>(key, initialValue, isValid)` validates stored JSON before returning a typed value and setter. The name field accepts strings. The theme accepts `dark` and `light`.

### Saved lists and recovery

The app keeps valid items in order when a saved list contains a damaged row. If an older save gives two rows the same ID, both remain editable independently. The app writes the recovered list on the next edit. If the browser refuses that write, a message explains that edits are available for this tab.

To run the mobile and desktop browser checks from the repository root:

```sh
npm --prefix Week10AdvancedTypeScriptAndAuthentication/Day1UsingTypeScriptWithReact/Exercises/ExercisesXPGold install --no-package-lock
cd tests/browser/react-state
npm ci
npx playwright install chromium
npm test -- --config typed-shopping.config.js
```

## 🧠 What I learned

- With a discriminated union, inside `case "toggled"` TypeScript knows `action.id` exists and `action.name` doesn't
- The `const unhandled: never = action` line is a free reminder from the compiler when I add a new action
- `as const` on the hook's return keeps it a tuple, so the value and the setter keep their own types
- Throwing in `useTheme` moves the "is there a provider?" check to one place instead of every component

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 10 Day 1 - Using TypeScript with React - Exercises XP Gold
