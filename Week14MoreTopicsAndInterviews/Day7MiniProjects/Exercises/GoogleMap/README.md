# 🗺️ Mini Project - Google Map

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

Choose latitude and longitude, center a Google map and place its marker at the selected coordinates. The form and map use responsive Bootstrap styling.

## ▶️ How to run

    npm install
    cp .env.example .env.local
    npm run dev

Set VITE_GOOGLE_MAPS_API_KEY to your own browser-restricted Maps JavaScript API key in the ignored .env.local file, then restart Vite. Restrict website referrers to the local and deployed URLs and restrict the key to Maps JavaScript API. Browser keys are visible in the downloaded application, so restrictions are required.

A missing key leaves the coordinate form usable and explains the configuration. Invalid coordinates, SDK loading and authorization errors have visible states.

## Coordinate validation and recovery

Latitude accepts -90 through 90 and longitude accepts -180 through 180, including
zero and both endpoints. Ordinary decimal/scientific numeric text is supported.
The shared parser rejects blank, non-finite, out-of-range or nonnumeric values;
booleans, arrays and null cannot silently become a different location.

Submitting an invalid field focuses it, marks it as invalid and associates it
with the announced error. Editing that field clears its previous error, and
Enter submits the corrected coordinates. The last valid location and Google
Maps link stay unchanged until both values are valid. These form interactions
also work without a Maps key.

## Reproducible checks

```sh
npm test
npm run build
```

The native Node tests cover geographic boundaries, decimal/scientific input,
missing fields, non-finite values and unwanted JavaScript coercion. They require
no credentials or service calls. To try keyboard recovery, submit latitude 91,
correct it to -90, clear longitude, then enter -180 and press Enter. Focus and
the associated error identify each field to correct; the selected location
updates only after the final valid submission.

The production form was checked in Edge at 320, 390 and 1440 px with external
requests blocked. This verifies the no-key form and navigation-link behavior;
Google's live SDK, tiles, key authorization and quotas require a configured key
and are separate integration checks.

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
