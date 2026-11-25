# 💪 Daily Challenge - Age Tracker

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/age-tracker-449779a6f6.svg" width="100%" alt="Progress card for Age Tracker">

</div>

An age counter where every click goes through an async thunk. Each thunk waits one second before it changes the age, so I could see the `pending` and `fulfilled` steps and show a spinner in between.

## ▶️ How to run

```bash
npm install
npm run dev
```

## Course implementation

`AgeDisplay` shows the age and pending state. `AgeControls` dispatches the two async thunks from a form.

## 🎯 The challenge

| Piece | What it does |
|---|---|
| `ageUpAsync` | `createAsyncThunk` that waits 1 s and returns `1` |
| `ageDownAsync` | Same with `-1`, plus a `condition` that cancels it when the age is already 0 |
| `ageSlice` | `extraReducers` set `loading` on `pending` and add the payload on `fulfilled` |
| `AgeTracker` | Shows the age and a spinner, and disables both buttons while `loading` is true |

The spinner slows down a lot when the system asks for reduced motion.

## 🧠 What I learned

- `createAsyncThunk` dispatches `pending` and `fulfilled` actions by itself, and the slice handles them in `extraReducers` with the builder
- The value returned from the thunk becomes `action.payload` in the `fulfilled` case
- `condition` stops a thunk before anything is dispatched, a nicer guard than checking inside the reducer
- `reducers: {}` can stay empty when every change comes from thunks

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 9 Day 4 - Redux Toolkit and Async Logic - Daily Challenge
