# 🥉 Exercises XP

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xp-200dd1c988.svg" width="100%" alt="Progress card for Exercises XP">

</div>

One page with three sections: a GET form, a POST form and a JSON exercise with the Mario game object.

## ▶️ How to run

Open `index.html` in a browser for the GET form. To see the POST request in the Network tab, serve the repository from its root:

```bash
npm run dev
```

and go to `http://localhost:8000/Week4AdvAsynchronousJavaScript/Day3HTTPAndFormMethodGETAndPOST/Exercises/ExercisesXP/`. Python's simple server only handles GET, so it answers the POST with an error, but the request and its form data are still visible in DevTools.

## 🎯 The challenge

1. **GET form** — the data ends up in the URL after `?`. On load, `readGetParams()` reads it with `URLSearchParams` and prints it as JSON.
2. **POST form** — the data is not in the URL; it goes in the request body (DevTools → Network → Payload).
3. **JSON Mario** — `makeMarioJSON()` turns `marioGame` into pretty JSON and shows it. **Make JSON (with debugger)** stops on `debugger;` first so I can inspect the values.

## 🧠 What I learned

- GET is visible in the URL, so it is not for private data
- POST data travels in the body of the request
- The Network tab shows exactly what a form sends

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 4 Day 3 - HTTP and GET/POST Forms - Exercises XP
