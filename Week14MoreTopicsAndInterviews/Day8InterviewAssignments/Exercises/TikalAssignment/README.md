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

## Checking the results

`npm test` checks pagination, shared requests, retry, tied vehicles and unknown populations with local fixtures. To repeat the live check without opening a browser, run this from the exercise directory with a network connection:

```bash
node --input-type=module -e "import { createSwapiClient, loadChallenge } from './src/swapi.js'; const result = await loadChallenge(createSwapiClient()); console.log(result.vehicleCount, result.winners, result.planets);"
```

On 2026-11-26 SWAPI returned 39 vehicles. The winning vehicle was the Tsmeu-6 personal wheel bike, and all five named planets had chart entries. The fixture tests remain repeatable if the live dataset changes.
