# Pokédex App

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/pokedex-0fed258102.svg" width="100%" alt="Progress card for Pokedex">

</div>

A Pokédex I built with the [PokeAPI](https://pokeapi.co/). The page looks like a red Pokédex device: a screen for the official artwork, a tan info panel, a D-pad and a green button. You can get a random Pokémon or move through them one by one.

## How to run

No install needed. Open `index.html` in a modern browser. The HTML, CSS and JavaScript are all inside that file.

- **Green button:** random Pokémon (1 to 1010)
- **D-pad left / right:** previous or next Pokémon. It wraps around, so after #1010 comes #1.
- The info panel shows name, number, height (m), weight (kg) and the types as colored badges.

## How it works

Each Pokémon comes from `https://pokeapi.co/api/v2/pokemon/{id}`:

```javascript
async function fetchPokemon(pokemonId) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    const data = await response.json();
    return data;
}
```

- `currentPokemonId` keeps track of the current Pokémon between clicks, so previous/next work. `MAX_POKEMON` is 1010.
- `getRandomPokemon()`, `getPreviousPokemon()` and `getNextPokemon()` call `fetchPokemon()`, then `displayPokemonImage()` and `displayPokemonInfo()` update the device.
- `disableButtons()` / `enableButtons()` block the controls during a request so clicks can't overlap.
- `showLoading()` shows a spinner. On network errors or bad data, `showError()` shows "Oh no! That Pokemon isn't available...".
- On small screens the layout stacks, with the info panel on top.

## What I learned

- Fetching JSON with async/await and handling the loading and error states
- Keeping a small piece of global state to drive navigation
- Building a detailed UI with only CSS (gradients, animations, flexbox and grid)

Ideas for later: search by name, abilities and moves, evolution chains.

## Credits

Pokémon data comes from [PokeAPI](https://pokeapi.co/). Pokémon and Pokédex are trademarks of Nintendo/Game Freak.
