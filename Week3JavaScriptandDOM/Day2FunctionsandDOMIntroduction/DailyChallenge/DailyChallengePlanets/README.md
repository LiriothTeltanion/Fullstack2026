# 💪 Daily Challenge - Planets

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/daily-challenge-planets-bcd2f51b89.svg" width="100%" alt="Progress card for Daily Challenge Planets">

</div>

My little solar system. Every planet is a colored circle with its name in it, and its moons are spread around it. Nothing is written in the HTML: the script builds it all from an array.

## ▶️ How to run

Open `planets.html` in a browser (or run `npm run dev` from the repo root and open this folder at `http://localhost:8000/`). There is no build step.

## 🎯 The challenge

- `planets.js` starts with an array of 8 planet objects, each with a `name`, a `color` and a number of `moons`.
- It grabs `<section class="listPlanets">` and makes it a wrapping flex row with a 20px gap.
- For each planet it creates a `.planet` div, paints the background, writes the name and appends it.
- For each moon it adds a `.moon` div inside the planet and moves it with `rotate(angle) translate(70px) rotate(-angle)`, where `angle = (i / moons) * 360`. That spaces the moons evenly on a circle.

The moon counts are made-up demo numbers, not the real ones. More notes are in [README_Solar_System.md](README_Solar_System.md).

## 🧠 What I learned

- With `createElement()` and `appendChild()` I can turn an array of data into elements on the page
- One `forEach` per planet and one `for` per moon was all the looping I needed
- Rotate, push out with `translate`, then rotate back: the moon lands on the circle and stays upright
- I can set styles straight from JavaScript through `element.style`

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 3 Day 2 - Functions and DOM Introduction - Daily Challenge
