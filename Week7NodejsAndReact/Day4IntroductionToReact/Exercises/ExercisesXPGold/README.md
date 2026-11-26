# 🥇 Exercises XP Gold

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xp-gold-1bdf261c68.svg" width="100%" alt="Progress card for Exercises XP Gold">

</div>

Three exercises about props and lists. The default view now uses a real `BootstrapCard` component and a six-planet list. The earlier custom cards, eight-planet list and social links remain available under **Compare the original custom components**. All original profile data is preserved in `src/data.js`.

## ▶️ How to run

```bash
npm ci
npm test
npm run build
npm run dev
```

Then open the address Vite prints (usually http://localhost:5173).

Use Node.js 22.13+ or a supported newer release. Vite requires Node.js 20.19+ or 22.12+; Node 24+ is a straightforward current option. The portable npm lockfile includes React 18 under its unchanged range, Bootstrap 5.3.9 and the repository-compatible Vite 7.3.8 / React plugin 4.7.0 pair. No CDN or remote asset request is needed. To review the production build, run `npm run preview -- --host 127.0.0.1`.

## 🎯 The challenge

1. **Bootstrap cards** (`components/BootstrapCard.jsx`): one reusable component rendered for Bob Dylan, Paul McCartney and Ada Lovelace. Props supply the name, description, initials color, button label and destination. Bootstrap's actual `card-header`, `card-body`, `card-title`, `card-text` and `btn` styles are loaded from the npm package. A missing optional link produces readable fallback text instead of a dead button.
2. **Six planets** (`components/SixPlanetList.jsx`): exactly Mercury, Venus, Earth, Mars, Jupiter and Saturn, in order, using Bootstrap list-group markup. This is an exercise subset, not a claim that the Solar System contains only six planets.
3. **Original examples** (`OriginalExercises.jsx`): the earlier `Card`, `PlanetList` and `SocialMedia` components, original data and original `index.css` remain unchanged. An accessible native disclosure keeps the original three cards, all eight planets and three social links available for comparison.

I used initials instead of photos so the page has no image files that could go missing.

The new `exercise.css` uses narrow overrides to isolate the original `.card` styling from Bootstrap cards and preserve readable Bootstrap button colors. The layout uses three columns on large screens, two from 768 px and one on small screens. Keyboard users can skip to the exercises, open the original examples with Enter or Space and follow profile links; new-tab links include an accessible announcement. Reduced-motion preferences disable transitions.

## Verification and limits

`npm test` runs six assertion-based component tests against the actual JSX with React's server renderer: props, missing-link fallback, safe text, six-item order, original content and the normal App entrypoint. Browser checks additionally verify the built application, computed Bootstrap card/button styles, contrast, responsive layout, keyboard disclosure/link operation and the original eight-planet variant. See [test details](tests/README.md).

The original profile texts and external destinations are learning examples; this app is not an account system. No external site needs to be opened or personal information entered for the checks. The default six-item list and component styling resolve the documented implementation gaps; personal understanding and any teacher assessment remain separate.

Bootstrap is used under its [MIT license](https://github.com/twbs/bootstrap/blob/v5.3.9/LICENSE). Implementation follows its official [card documentation](https://getbootstrap.com/docs/5.3/components/card/) and [npm installation guidance](https://getbootstrap.com/docs/5.3/getting-started/download/).

## 🧠 What I learned

- Destructuring the props in the function header (`{ name, description, ... }`) makes the component easy to read
- The spread `{...person}` passes every key of the object as its own prop
- `map((planet, index) => ...)` gives me the position too, which I used for the numbers
- Moving the data to its own file kept `App.jsx` short

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 7 Day 4 - Introduction to React - Exercises XP Gold

Built with AI-assisted tooling; I reviewed, tested and can explain every change.
