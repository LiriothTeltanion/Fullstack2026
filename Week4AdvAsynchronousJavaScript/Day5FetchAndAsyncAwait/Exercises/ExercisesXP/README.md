# 🥉 Exercises XP

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xp-e8ff4d5aaf.svg" width="100%" alt="Progress card for Exercises XP">

</div>

Four small exercises with the Fetch API and async/await. Each one has its own button in `index.html` and writes a short result in the output panel.

## ▶️ How to run

1. Copy `js/config.example.js` to `js/config.js` and put your own restricted Giphy development key in it. `config.js` is ignored by Git.
2. From the repository root:

```bash
npm run dev
```

3. Open `http://localhost:8000/Week4AdvAsynchronousJavaScript/Day5FetchAndAsyncAwait/Exercises/ExercisesXP/`, open DevTools → Console and click each button.

Without a key, exercises 1 and 2 show `Missing Giphy API key. ...`; exercises 3 and 4 still work.

## 🎯 The challenge

1. **Giphy "hilarious"** — logs the full JSON and shows the count and the first GIF's title and URL.
2. **Giphy "sun"** — `limit=10` and `offset=2`, then shows the 10 titles.
3. **SWAPI starship 9** — async/await only, no `.then()`. Logs `result` and shows the starship's name.
4. **Analyse the snippet** — `asyncCall()` shows `calling` right away and `resolved` about 2 seconds later.

`handleStatus()` throws on any non-2xx response, and every exercise is wrapped in `try/catch`.

## 🧠 What I learned

- `fetch` only rejects on network errors, so I have to check `response.ok` myself
- `await` pauses only the async function, not the whole page
- `URL` and `searchParams` build query strings safely
- A key used in the browser is visible to everyone, so it stays out of Git and should be a restricted one

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 4 Day 5 - Fetch and Async/Await - Exercises XP
