# Star Wars Character Finder

<div align="center">

<img src="../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../assets/readme/progress/star-wars-web-app-63b913747f.svg" width="100%" alt="Progress card for Star Wars Web App">

</div>

A single-page app I built for the Week 5 Day 1 mini project. It uses the [Star Wars API (SWAPI)](https://www.swapi.tech/) to show a random character every time you click **Find Someone**: name, height, gender, birth year and home world.

## How to run

No install needed. Open `index.html` in a modern browser and click the button. The HTML, CSS and JavaScript are all inside that one file.

## How it works

- `findRandomCharacter()` picks a random ID between 1 and 83 and coordinates everything.
- `getCharacterData()` fetches the character, then `getHomeworldName()` makes a second request for the planet name.
- `showLoading()`, `showError()` and `displayCharacter()` switch the UI between loading, error and result.
- The button is disabled while loading so you can't fire several requests at once.
- Network errors, missing characters and planet lookup failures all show: "Oh No! That person isn't available."

The styling is a black starry background, a card with golden borders, a spinner and a few animations, with media queries for small screens. Icons come from Font Awesome.

## What I learned

- Using `fetch` with async/await instead of chained `.then()` calls
- Chaining two dependent API requests
- Handling loading and error states so the page never looks stuck
