# 🌌 Tikal Assignment - Star Wars Population

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

A React application with both parts of the population challenge. It queries SWAPI directly.

## ▶️ How to run

```bash
npm install
npm run dev
npm test
npm run build
```

## Vehicle calculation

The app reads all pages of vehicles, loads their pilots and each pilot's homeworld, then finds the largest population total. It displays every tied winner with its pilots, planets and populations.

Each pilot contributes their home planet's population. Two pilots from one planet contribute twice. This interpretation follows the population total per pilot. Unknown populations contribute zero and remain labeled. Empty or malformed population values are treated as unknown.

A promise cache shares duplicate people and planet requests. Failed requests leave the cache so the Retry button can try again. A stale component load cannot overwrite a newer render.

## Population chart

The second section compares Tatooine, Alderaan, Naboo, Bespin and Endor using plain HTML and CSS bars, a linear scale, numeric labels and a legend. It uses no chart library.

Loading, failure and retry states are visible. Internet access and SWAPI availability are required.

[SWAPI documentation](https://swapi.dev/documentation) · [Assignment source](https://github.com/devtlv/studentsGitHub/blob/master/JS/Week10-ProjectsWeek/Day1/Tikal%20Project/Tikal%20Home%20Assignment%20-%20Star%20Wars.pdf)

Created 2026-11-25, Asia/Jerusalem.
