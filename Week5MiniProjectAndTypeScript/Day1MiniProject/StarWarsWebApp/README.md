# 🎮 Mini Project - Star Wars Character Finder

<div align="center">

<img src="../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../assets/readme/progress/star-wars-web-app-63b913747f.svg" width="100%" alt="Progress card for Star Wars Web App">

</div>

Every click on **Find Someone** shows a random character from the [Star Wars API (SWAPI)](https://www.swapi.tech/): name, height, gender, birth year and home world.

## ▶️ How to run

The page is one file, `index.html`. Open it in a browser and press the button. With `npm run dev` from the repository root, it is also at `http://localhost:8000/Week5MiniProjectAndTypeScript/Day1MiniProject/StarWarsWebApp/`.

## 🎯 The challenge

| Function | What it does |
|---|---|
| `findRandomCharacter()` | Gets a random ID from 1 to 83 and runs the whole flow |
| `getCharacterData(id)` | Checks the ID, then fetches `swapi.tech/api/people/{id}` |
| `getHomeworldName(url)` | A second request for the planet name; returns `'Unknown'` if it fails |
| `showLoading()` / `showError()` / `displayCharacter()` | Switch the card between loading, error and result |

The button stays disabled until the request ends, so two clicks can't overlap. When something goes wrong the card says "Oh No! That person isn't available." `escapeHtml()` cleans the text before it goes into `innerHTML`. Styling is a starry background, a gold-bordered card and Font Awesome icons.

## 🧠 What I learned

- async/await reads top to bottom, much easier to follow than a chain of `.then()` calls
- The character JSON only has a URL for the home world, so I need a second `fetch` that waits for the first
- Returning `'Unknown'` from the planet request keeps the card working even if that call breaks
- Disabling the button while loading is the simplest way to stop double requests

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 5 Day 1 - Mini-projects - Mini Project
