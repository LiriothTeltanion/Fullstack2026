# 💪 Daily Challenge - Avengers

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/avengers-c54b237b88.svg" width="100%" alt="Progress card for Avengers">

</div>

A Thor feature with original CSS lightning and hammer artwork, list-based navigation and footer links. Below it, a fan page with one card for each of the six original Avengers: hero name, real name, a one-line bio and their power. All the cards share one set of rules, and each gets its own color from a single custom property, `--hero`, set inline in [index.html](index.html).

## ▶️ How to run

No build step. Open [index.html](index.html) in a browser, or serve the folder:

```bash
python -m http.server 8000
```

The page also links to the Day 2 version, so serve the repository root to keep that relative link available. No deployment is needed for this exercise.

## 🎯 The challenge

1. **Banner.** Thor has a styled heading and description over original CSS lightning gradients and a geometric hammer drawn with pseudo-elements. The artwork is decorative; all information remains real text.
2. **Team grid.** `ul.team` is a flex container with `flex-wrap: wrap`. Each card is `flex: 1 1 280px`, so a laptop shows three per row and a phone shows one.
3. **Cards.** The round emblem is a `span` centered with `display: grid; place-items: center`. The top border, the emblem and the "Power" tag all read `var(--hero)`.
4. **Navigation.** The main navigation uses `nav > ul > li > a`; its anchors target Thor, the team and About. Footer links return to those sections and open the [responsive Day 2 version](../../../Day2GitAndGitHub/DailyChallenge/MediaQueries/index.html). Keyboard focus is visible.
5. **Motion.** Hovering lifts a card with `transform: translateY(-6px)`. Inside `@media (prefers-reduced-motion: reduce)` the transition and the lift are switched off.

## 🧠 What I learned

- A custom property on each card (`style="--hero: #c62828"`) let six cards look different with one CSS rule
- `flex: 1 1 280px` means grow, shrink and start at 280px, and that line alone made the layout responsive
- The emblems only repeat the initials, so they get `aria-hidden="true"` and the `h2` carries the name
- My first Black Widow color was almost black and vanished on the dark card, so I switched to a grey-blue

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 13 Day 1 - HTML and CSS - Daily Challenge

## Update · 2026-11-25 · Asia/Jerusalem

Added the Thor feature, a navigation list and working footer links while retaining all six original team cards, their content, colors and reduced-motion behavior. The [Day 2 exercise](../../../Day2GitAndGitHub/DailyChallenge/MediaQueries/index.html) reuses this stylesheet and adds its own breakpoint rules.
