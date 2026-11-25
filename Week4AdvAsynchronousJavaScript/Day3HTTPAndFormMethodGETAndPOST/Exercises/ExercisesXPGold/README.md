# 🥇 Exercises XP Gold

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xpgold-f1d06e9641.svg" width="100%" alt="Progress card for Exercises XPGold">

</div>

A two-page form: `index.html` sends a name and a last name with GET to `result.html`, which reads them from the URL and writes them into a `<section>`.

## ▶️ How to run

Open `index.html` in a browser, keep the default values (John Doe) or type new ones, and press **Submit**.

`result.html` shows:

```
NAME: John
LAST NAME: Doe
```

## 🎯 The challenge

1. **The form** — `action="result.html"` and `method="get"`, with `name` and `lastname` inputs.
2. **The result page** — a small inline script reads both values with `URLSearchParams`, trims them and adds one `<p>` per value to `<section id="output">`. An empty value shows `(empty)`.

## 🧠 What I learned

- A form's `action` can point to another page
- GET makes the values available to the next page through the URL
- `textContent` is a safe way to put user input on the page

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 4 Day 3 - HTTP and GET/POST Forms - Exercises XP Gold
