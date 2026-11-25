# 🥉 Exercises XP

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xp-4b75acb0a5.svg" width="100%" alt="Progress card for Exercises XP">

</div>

One HTML page with three small exercises about forms and JSON: a GET form, a POST form and a `JSON.stringify` demo with the Mario game object.

## ▶️ How to run

Open `http_forms_json_exercises.html` in a browser, or serve the repository from its root:

```bash
npm run dev
```

and go to `http://localhost:8000/Week4AdvAsynchronousJavaScript/Day1AdvancedArrayMethods/Exercises/ExercisesXP/http_forms_json_exercises.html`.

## 🎯 The challenge

1. **GET form** — sends `name` and `message` to the same page. The data shows up in the URL as a query string, and `parseQuery()` reads it back with `URLSearchParams` and prints it as JSON next to the full URL.
2. **POST form** — the submit handler calls `preventDefault()`, so no request is sent. It logs the form data with `Object.fromEntries(new FormData(form))` and shows an alert.
3. **JSON Mario** — **Make JSON** turns `marioGame` into a compact string and a pretty one (`JSON.stringify(obj, null, 2)`), shows both and stops on a `debugger;` line so I can inspect them in DevTools.

## 🧠 What I learned

- GET puts the form data in the URL, POST puts it in the request body
- `URLSearchParams` makes reading a query string easy
- `JSON.stringify` keeps nested objects nested, it just turns them into text
- `debugger;` pauses the code when DevTools is open

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 4 Day 1 - Advanced Array Methods - Exercises XP
