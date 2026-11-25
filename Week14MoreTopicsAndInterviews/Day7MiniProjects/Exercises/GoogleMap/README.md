# 🗺️ Mini Project - Google Map

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

Choose latitude and longitude, center a Google map and place its marker at the selected coordinates. The form and map use responsive Bootstrap styling.

## ▶️ How to run

    npm install
    cp .env.example .env.local
    npm run dev

Set VITE_GOOGLE_MAPS_API_KEY to your own browser-restricted Maps JavaScript API key in the ignored .env.local file, then restart Vite. Restrict website referrers to the local and deployed URLs and restrict the key to Maps JavaScript API. Browser keys are visible in the downloaded application, so restrictions are required.

A missing key leaves the coordinate form usable and explains the configuration. Invalid coordinates, SDK loading and authorization errors have visible states.

## 🎯 The challenge

[coordinates.js](src/coordinates.js) validates finite latitude -90..90 and longitude -180..180. [MapCanvas.jsx](src/MapCanvas.jsx) loads Google Maps, centers it and renders MarkerF. The initial location is the public city center of Beer Sheva.

## Library compatibility

The course's react-google-maps 9.4.5 declares React 15/16 peer dependencies. This project follows the repository's React 19 setup and uses @react-google-maps/api 2.20.8, whose peer dependencies include React 19. This keeps the same Google Maps SDK integration and marker requirement.

## Key and usage

Google documents a no-cost [Maps Demo Key](https://developers.google.com/maps/documentation/javascript/demo-key) for prototypes without billing. Its limits pause usage when the quota is reached. Use the Google account flow to obtain your own key and keep it in .env.local.

For a standard key, review the [official setup and restrictions](https://developers.google.com/maps/documentation/javascript/get-api-key). This repository does not activate billing or create Google Cloud credentials.

The wrapper's [source and examples](https://github.com/JustFly1984/react-google-maps-api) document the maintained integration.

---

## 👤 Author

Kevin Cusnir · Fullstack2026 · Week 14 Day 7
