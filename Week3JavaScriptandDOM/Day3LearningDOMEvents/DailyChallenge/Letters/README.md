# 💪 Daily Challenge - Letters

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/letters-f1db44c3f7.svg" width="100%" alt="Progress card for Letters">

</div>

A text field that only accepts letters. If I type or paste numbers or symbols, they vanish right away.

## ▶️ How to run

Open `index.html` in a browser (or run `npm run dev` from the repo root and go to `http://localhost:8000/Week3JavaScriptandDOM/Day3LearningDOMEvents/DailyChallenge/Letters/`), then type in the field.

```
Typed:  abc123!de
Field:  abcde
Helper: Non-letter characters were removed. ✅
```

## 🎯 The challenge

- An `input` listener fires after every change (typing, paste, drag and drop) and replaces `/[^a-z]/gi` with `""`.
- When it removed something, it puts the caret back where I was typing and updates the helper text under the field.
- The form's `submit` listener calls `preventDefault()` and shows `Submitted: "..." ✅`, or `Nothing to submit.` for an empty field.
- I also wrote a `keydown` version that blocks bad keys before they appear. It is still in the file, commented out, because it can't catch a paste on its own.

## 🧠 What I learned

- `input` fires for paste and autofill too, so it covers cases `keydown` misses
- With the `g` and `i` flags, one `replace()` call strips every non-letter, upper or lower case
- Setting `input.value` throws the caret to the end, and `setSelectionRange()` moves it back
- The submit message sits in an `aria-live="polite"` element, so a screen reader reads it out

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 3 Day 3 - DOM Events - Daily Challenge
