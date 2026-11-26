# 🥷 Exercises XP Ninja

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xp-ninja-8f96f995dd.svg" width="100%" alt="Progress card for Exercises XP Ninja">

</div>

## ⏱️ Clock, custom validation & the original quotes

The default **Clock & form** view combines a live local clock with a custom-validated profile preview. **Quote machine** opens the original exercise: every click shows a new programming quote and paints the page in a new color, and neither the quote nor the color repeats twice in a row.

## ▶️ How to run

```bash
npm ci
npm run dev
```

Open the address Vite prints (usually http://localhost:5173).

Use Node.js 22.13 or newer in the 22.x line, or Node.js 24+. Vite 7.3.8 and the React plugin 4.7.0 are pinned in the app lockfile; React remains in its original 18.3 range. For a production check:

```bash
npm test
npm run build
npm run preview
```

## 🕰️ Live clock and lifecycle

`LiveClock` is a class component. It starts one one-second ticker on mount and clears it on unmount. Every tick reads the actual device time, rather than adding a second to an old value, so delayed background callbacks cannot accumulate clock drift. The display uses a 24-hour time, date and the browser's time-zone name. Seconds are not announced through a screen-reader live region.

Open **Quote machine**, then return to **Clock & form** to see the clock resume with the current time. The form remains mounted while hidden so its draft stays available; the clock unmounts so its interval is cleaned up. The original quote component also stays mounted, preserving its quote counter. View changes move keyboard focus to the newly displayed content.

## 📝 Custom form rules

This is a local validation exercise. Use invented details; it creates no account and makes no API request. Its field choices and rules are explicit:

| Field             | Practice rule                                                                                                                                                                                                               |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Full name         | Required; 1–80 Unicode code points, starting with a letter. Letters, combining marks, numbers, spaces, apostrophes, periods and hyphens are accepted. Whitespace is normalized; control characters and markup are rejected. |
| Email             | Required; up to 254 characters, with an ASCII local part and dot-separated domain labels. Empty labels, consecutive local dots and markup are rejected. This checks syntax, not mailbox delivery.                           |
| Practice password | 8–128 Unicode code points, including at least one letter and one number. Emoji count by code point, matching the name-length convention. The value is not trimmed or normalized.                                            |
| Confirmation      | Required and exactly equal to the practice password.                                                                                                                                                                        |

`formValidation.js` owns these rules, and the form uses `noValidate` so the custom messages control the flow. Errors appear after a field is touched or the form is submitted; labels, hints and error IDs are linked, and an invalid submission focuses the first failing field. Changing the password rechecks its confirmation.

A valid submission previews only the normalized name and trimmed email. Both password fields are immediately cleared and concealed again. No values are written to cookies, localStorage or sessionStorage. Reset clears the form, feedback and preview, then focuses the name field. The browser's own autofill settings remain under the user's control.

## 🧪 Focused tests

`npm test` uses Node's built-in runner for valid/invalid input, Unicode length boundaries, password-free preview data, immutable input handling, current-time ticks and idempotent timer cleanup. It also checks 1,000 non-repeating picks from the original quote helper. No external service is needed.

For a manual browser check, submit an empty form, correct its fields, change a confirmed password, then validate sample values. Confirm that the successful preview contains no password. Switch to quotes and back to check draft retention and clock cleanup, then use **Reset form**.

## 🎯 The challenge

The table below documents the preserved quote-machine files. Their original implementation remains available through **Quote machine**; the new clock and validation components are separate.

| File                      | What it does                                                                                    |
| ------------------------- | ----------------------------------------------------------------------------------------------- |
| `quotes.js`               | Six quotes with their authors and six colors                                                    |
| `randomPick.js`           | `randomOtherIndex(length, current)` picks a random index that is not the current one            |
| `App.jsx`                 | Keeps `quoteIndex`, `colorIndex` and a `seen` counter in state; `nextQuote()` updates all three |
| `components/QuoteBox.jsx` | Shows the quote and author in the current color and the "New quote" button                      |

The background, text and button fade between colors with CSS transitions, which are turned off for reduced motion.

I checked `randomOtherIndex` with 1000 picks in a row: 0 repeats, and with a list of one item it returns 0 instead of looping forever.

## 🧠 What I learned

- Storing indexes instead of whole quote objects keeps the state small
- `useState(() => ...)` runs the random start only once, not on every render
- The `while` loop needed the `length < 2` guard, or a one-item list would never finish
- A color in state can drive inline styles in several components at once

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 7 Day 5 - React Components and State - Exercises XP Ninja
