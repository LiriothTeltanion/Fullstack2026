# 🎮 Mini Project - Pokédex

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/pokedex-0fed258102.svg" width="100%" alt="Progress card for Pokedex">

</div>

A Pokédex built with [PokeAPI](https://pokeapi.co/). The page looks like a red Pokédex device: a screen for the official artwork, an info panel, a D-pad and a green button.

## ▶️ How to run

Open `index.html` in a modern browser; the HTML, CSS and JavaScript are all in that file. You can also run `npm run dev` from the repository root and go to `http://localhost:8000/Week5MiniProjectAndTypeScript/Day1MiniProject/Exercises/Pokedex/`.

- **Green button:** a random Pokémon from 1 to 1010
- **D-pad left / right:** previous or next Pokémon; it wraps around, so after #1010 comes #1
- The info panel shows name, number, height (m), weight (kg) and the types as colored badges

## 🎯 The challenge

| Function | What it does |
|---|---|
| `fetchPokemon(id)` | Fetches `https://pokeapi.co/api/v2/pokemon/{id}` and returns the JSON |
| `getRandomPokemon()` / `getPreviousPokemon()` / `getNextPokemon()` | Choose the ID, fetch it and update the device |
| `displayPokemonImage()` / `displayPokemonInfo()` | Draw the artwork and the info panel |
| `disableButtons()` / `enableButtons()` | Block the controls during a request |
| `showLoading()` / `showError()` | Spinner, or "Oh no! That Pokemon isn't available..." |

`currentPokemonId` remembers the current Pokémon between clicks, and `MAX_POKEMON` is 1010.

## 🧠 What I learned

- Fetching JSON with async/await and handling loading and error states
- Keeping a small piece of state to drive previous/next navigation
- Building a detailed device look with only CSS (gradients, flexbox and grid)

Pokémon data comes from PokeAPI. Pokémon and Pokédex are trademarks of Nintendo/Game Freak.

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 5 Day 1 - Mini-projects - Mini Project
