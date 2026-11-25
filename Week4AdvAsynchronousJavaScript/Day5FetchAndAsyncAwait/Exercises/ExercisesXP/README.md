# Exercises XP — Fetch API & Async/Await

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xp-e8ff4d5aaf.svg" width="100%" alt="Progress card for Exercises XP">

</div>

Four small exercises where I practiced the Fetch API, async/await, status checks and error handling. Each one has its own button in `index.html`.

## Files

```
ExercisesXP/
├─ index.html            # One button per exercise + output panel
├─ css/styles.css
└─ js/
   ├─ app.js             # Exercises 1–4
   └─ config.example.js  # Template for the local config.js (git-ignored)
```

## How to run

1. Copy `js/config.example.js` to `js/config.js` and put your own restricted Giphy development key in it. `config.js` is ignored by Git.
2. From the repository root, start a local server and open the exercise page:

```bash
python -m http.server 8000
```

3. Open DevTools (Console) and click each button:
   - **Exercise 1:** Giphy search for "hilarious" — full JSON in the console, a summary in the panel.
   - **Exercise 2:** Giphy search for "sun" with `limit=10&offset=2` — shows the titles.
   - **Exercise 3:** SWAPI starship with async/await only — logs `objectStarWars.result` and shows the name.
   - **Exercise 4:** shows `calling` right away, then `resolved` after about 2 seconds.

## Notes

- Every request checks `response.ok`, throws on non-2xx responses and is wrapped in `try/catch`.
- An older version had a hard-coded Giphy key. I removed it from the current files; any key that was ever committed should be treated as exposed and revoked.
- A key used in the browser is always visible to visitors, so only use a restricted development key here.
