# 💪 Daily Challenge - Letters

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/letters-f1db44c3f7.svg" width="100%" alt="Progress card for Letters">

</div>

A text field that keeps only letters: numbers and symbols disappear while I type or paste.

## ▶️ How to run

Open `index.html` in a browser (or run `npm run dev` from the repo root and open this folder at `http://localhost:8000/`), then type in the field.

```
Typed:  abc123!de
Field:  abcde
Helper: Non-letter characters were removed. ✅
```

## 🎯 The challenge

- An `input` listener runs after every change (typing, paste, drag and drop) and replaces `/[^a-z]/gi` with `""`.
- When something was removed, it moves the caret back to where I was typing and changes the helper text.
- The form's `submit` listener calls `preventDefault()` and shows `Submitted: "..." ✅`, or `Nothing to submit.`
- A `keydown` version that blocks keys before they land is left in the code as a commented-out alternative.

## 🧠 What I learned

- The `input` event catches paste and autofill, which `keydown` alone misses
- A regex with the `g` and `i` flags removes every non-letter in one call
- Changing `input.value` moves the caret, so `setSelectionRange()` puts it back
- `aria-live="polite"` lets screen readers announce the submit message

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 3 Day 3 - DOM Events - Daily Challenge
