# 🎮 Mini Project - Herolo Assignment

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/herolo-assignment-3393c34021.svg" width="100%" alt="Progress card for Herolo Assignment">

</div>

My take on the Herolo weather home assignment: search a city, see the current weather and a 5-day forecast, save favorites, and switch between °C/°F and light/dark.

[Open the live weather app](https://fullstack2026-herolo.onrender.com/) · [Browse the exercise source](https://github.com/LiriothTeltanion/Fullstack2026/tree/main/Week8React/Day3ReactAdvancedHooks/Exercises/HeroloAssignment)

The demo opens on Tel Aviv using Open-Meteo. Try adding the city to Favorites, reloading the page and opening its forecast again. The AccuWeather option requires an active key on the host.

The original no-key mode uses Open-Meteo, so it still runs straight after `npm install`. The provider selector also supports AccuWeather through a same-origin Node proxy: its account key stays on the server, never in the browser bundle. Both modes keep the existing city search, favorites, unit switch and theme.

## ▶️ How to run

```bash
npm install
npm run dev
```

Vite prints a local address (usually `http://localhost:5173`); I open it in the browser.

### AccuWeather mode

Use Node 22.13+ or a supported newer Node release. Copy `.env.example` to the
ignored `.env.local` file and privately set `ACCUWEATHER_API_KEY` to your own
active account key. Restart the dev server and choose **AccuWeather (server
key)**. Never use a `VITE_` prefix for this key: those variables are public.

```sh
cp .env.example .env.local
npm run dev
```

Without a configured key, selecting AccuWeather explains the missing server
configuration. Choose Open-Meteo to continue with the original service. No account,
subscription or billing is created by this app. Open-Meteo mode still requires
access to its public geocoding/forecast service; it is not an offline weather feed.

For a production build with the same API routes:

```sh
npm run build
npm start
```

The production server listens on `127.0.0.1:4173` by default and serves only
`dist/`, plus its two fixed weather routes. It supports the `/favorites` route
on a direct reload. `npm run preview` also includes the local proxy. A static-only
host can run the original Open-Meteo mode; AccuWeather needs the Node server (or a
deliberately configured equivalent backend), not a key embedded in a static build.

### Provider boundary and usage

- `/api/weather/accuweather/locations?q=...` calls the city-specific autocomplete
  endpoint and returns up to five city suggestions.
- `/api/weather/accuweather/forecast` fetches current conditions and five daily
  forecasts by location key. The initial Tel Aviv coordinates use geoposition
  lookup, so they share a canonical favorite identity with the same search result.
- Server requests use HTTPS and bearer authentication. Raw provider error bodies,
  request headers and keys are never forwarded to the browser. Input, missing-key,
  access, quota, network, timeout and incomplete-response states are distinct.
- The in-memory cache lasts at most five minutes and honors earlier `Expires`,
  `max-age`/`Age`, `no-cache` and `no-store` directives. Invalid data is not retained
  across retries. No forecasts are written to disk or localStorage.
- Each server process caps upstream attempts at 100 per rolling 24 hours, including
  failed requests; cached reads do not consume another attempt. Restarting resets
  this local guard. It does not replace account-side limits or deployment access
  controls: keep the default loopback binding for local use and review those
  controls before exposing an account-backed endpoint publicly.
- AccuWeather data displays its name and linked official logo. The logo is loaded
  from the provider's public asset URL rather than copied into this repository.
  Favorites record each city's provider; older saved Open-Meteo cities retain
  their original identifiers and remain accessible.

The [official authentication guidance](https://developer.accuweather.com/documentation/authentication)
recommends a server-side proxy. Its [plans](https://developer.accuweather.com/documentation/overview)
and [FAQ](https://developer.accuweather.com/faq), checked on 2026-11-26, describe the
$0 offering as a **14-day trial with 500 daily Core Weather calls**, not an
indefinite free entitlement. This project neither enables a paid plan nor proves
that a particular account is authorized. See the provider's
[brand guidance](https://developer.accuweather.com/documentation/brand-guidelines)
and [five-day API quick-start](https://developer.accuweather.com/documentation/core-weather-quick-start).

### Tests

```sh
npm test
npm run build
```

The native Node suite tests the real adapter and loopback HTTP proxy with original
synthetic responses: city mapping, canonical default-city lookup, Celsius/Fahrenheit,
five days, authentication headers, input errors, missing keys, access/quota failures,
timeouts, malformed data, retry-cache recovery, cache expiry and the local budget.
It also checks malformed request URLs and rejected middleware at the HTTP boundary.
It sends no requests to a real provider and requires no credentials.

Saved-preference tests cover malformed JSON, incorrectly typed fields and mixed
valid/invalid favorites. A damaged saved entry cannot prevent the app from
loading; usable legacy Open-Meteo and AccuWeather favorites retain their data.

In Open-Meteo mode, zero is a valid temperature. If the current reading is
missing or daily highs and lows do not cover the returned dates, Home offers
**Retry weather**. A successful retry restores the forecast.

Production Edge checks exercised the actual Node proxy with a synthetic upstream
at 320, 390 and 1440 px: both provider modes, old/new favorites, unit/theme controls,
search failure, weather retry and persistence. A build with an ephemeral test value
confirmed that the server-only key was absent from client artifacts. These checks
do not claim a live AccuWeather account, licensed data, deployed service or visual
equivalence to an external reference.

## 🎯 The challenge

| Part | What it does |
|---|---|
| `api/weather.js` | `searchCities(query)` calls the Open-Meteo geocoding API; `getForecast(city, unit)` returns the current temperature and 5 days of min/max and weather code |
| `WeatherContext` | One `useReducer` for `favorites`, `unit` and `dark`, loaded from and saved to `localStorage` |
| `SearchBar` | Accepts English letters only (as the brief asks), waits 400 ms after the last key and lists up to 5 matching cities |
| `Home` | Starts on Tel Aviv, shows the current weather, the forecast cards and an add/remove favorite button |
| `Favorites` | One card per saved city with its current temperature; clicking a card opens it on Home through router state |
| `Header` | Navigation plus the °C/°F and dark mode toggles |

## 🧠 What I learned

- The third argument of `useReducer` lets me load the saved state once, lazily
- Router `state` passes a whole city object to another page without putting it in the URL
- Weather codes are numbers, so a small lookup table turns them into a label and an icon
- Changing `unit` in the context refetches the forecast because it is in the effect's dependencies

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 8 Day 3 - React Advanced Hooks - Mini Project
