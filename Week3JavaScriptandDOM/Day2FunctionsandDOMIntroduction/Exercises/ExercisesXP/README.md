# Exercises XP — JavaScript (Functions, DOM, Loops)

Short & simple solutions (commented in English) for 7 exercises. One HTML runner with buttons prints results to `<pre>` blocks and the console.

## Files
- `index.html` — UI to run each exercise and display outputs; includes required DOM scaffolds for Exercises 5–7.
- `script.js` — implementations for Exercises 1–7, plus helpers (`printOut`, `clearAll`, `runAll`).

## How to run
1. Open `index.html` in your browser.
2. Click **Run 1..7** or **Run ALL**. Check DevTools → Console too.
3. Some tasks (E4) ask for input via `prompt()`.

## Overview
- **E1 Divisible by 23** — `displayNumbersDivisible(divisor=23)` loops 0..500, prints numbers & sum.
- **E2 Shopping List** — builds total with `stock` & `prices`; decreases stock by 1 when purchased.
- **E3 What's in my wallet?** — `changeEnough(price, [q,d,n,p])` computes total and returns boolean.
- **E4 Vacations Costs** — prompts for hotel nights, destination, car days; prints itemized + total.
- **E5 Users (DOM)** — manipulates lists (rename, remove, classes, styles, hide “Dan”, border “Richard”), and bonus “Hello x and y” when bg is light blue.
- **E6 Change the navbar (DOM)** — renames id, appends “Logout”, prints first/last link text.
- **E7 My Book List (DOM)** — renders 2 books with 100px images; details in red if already read.

## Notes
- Code favors clarity over micro-optimizations.
- For E4, the “bonus” pattern is used: input prompts are only in `totalVacationCost()`.
- For E5/E6, the exact given HTML is present in `index.html` under each exercise card.

## License
Educational use. © 2025 Developers Institute prompt.
