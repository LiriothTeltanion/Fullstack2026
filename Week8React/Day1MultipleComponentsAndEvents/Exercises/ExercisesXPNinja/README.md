# 🥷 Exercises XP Ninja

**Current default:** a live class-based compass clock, with the earlier widgets
one click away. See [run and verify](#run-and-verify) for the production build,
date logic, lifecycle cleanup and browser tests.

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/week8-day1-exercises-xp-ninja-75eb3622ea.svg" width="100%" alt="Progress card for Exercises XP Ninja">

</div>

Three interactive widgets built only with `useState` and event handlers: tabs, a hover star rating and a box that follows the mouse.

## ▶️ How to run

```bash
npm install
npm run dev
```

Vite prints a local address (usually `http://localhost:5173`); I open it in the browser.

## 🎯 The challenge

1. **Tabs**: `Tabs` gets an array of `{ label, content }` and remembers the active index. The buttons use `role="tab"` and `aria-selected`.
2. **Star rating**: `StarRating` keeps two numbers, the saved `rating` and the `hovered` star. While the mouse is over the stars the hovered value wins, and leaving the row resets it.
3. **Mouse tracker**: `MouseTracker` reads `clientX` and `clientY`, subtracts the box position from `getBoundingClientRect()` and shows coordinates relative to the box.

## 🧠 What I learned

- `hovered || rating` was all I needed to preview a rating before clicking
- `Array.from({ length: max })` builds the stars without writing five buttons by hand
- `event.currentTarget` is the element with the handler, so its rectangle gives local coordinates
- `onMouseEnter` and `onMouseLeave` are enough to show a hint when the pointer is outside

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 8 Day 1 - Multiple Components and Events - Exercises XP Ninja

---

## Compass clock extension · 2026-11-26

The default practice now adds an original **class-based compass clock**. The
earlier tabs, star rating and mouse tracker remain available through **Original
widgets**. Their original application source is preserved in `src/GalleryDemo.jsx`.
The earlier description above documents that preserved gallery.

The clock displays the browser's local weekday, year, month, day, hours, minutes
and seconds, together with a 24-hour time and an original SVG compass-style dial.
All fields and hands come from the same `Date`, so a midnight tick changes the
whole date consistently. Cardinal labels are visual landmarks; this is not a
magnetic compass and it requests no location or orientation permission.

`CompassClock` extends React's `Component`. It starts one interval in
`componentDidMount`, reads current wall time on every tick rather than adding
seconds to stale state, and clears the interval in `componentWillUnmount`.
Switching to the original gallery unmounts the clock; returning creates a fresh
clock with the current time. There are no API calls, external fonts or images.

```text
src/App.jsx                       practice navigation
src/components/CompassClock.jsx   class state, lifecycle and dial
src/clock.js                      local date fields and hand angles
src/GalleryDemo.jsx               preserved original application
tests/                            date logic and production-page browser tests
```

### Run and verify

From this exercise directory:

```bash
npm ci
npm run build
npm ci --prefix tests
npx --prefix tests playwright install chromium
npm test --prefix tests
npm run dev
```

The application uses the repository's verified toolchain pair, Vite `7.3.8` and
React plugin `4.7.0`, with a reproducible application lockfile. React and React DOM
remain on their existing `^18.3.1` ranges. Node `^22.13.0 || >=24` matches the
repository's supported runtime. The separate test package pins its browser driver
and has its own lockfile. After installing both packages, `npm test` builds the
app and runs the complete focused suite. See [test details](tests/README.md) for
optional Edge and screenshot output settings.

Open **Original widgets**, try the three preserved examples, then return to
**Compass clock**. The new clock reads the current time immediately; its test
suite also verifies that the previous interval was removed before it remounts.

Learning check: explain why the interval belongs in `componentDidMount`, then
switch views and explain why cleanup prevents duplicate updates.

References: [React class lifecycle](https://react.dev/reference/react/Component#componentdidmount)
and [Playwright clock emulation](https://playwright.dev/docs/clock).

Built with AI-assisted tooling; I reviewed, tested and can explain every change.
