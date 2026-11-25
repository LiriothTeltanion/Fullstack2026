# 💪 Daily Challenge - HTML Form

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/htmlform-73d95fe81c.svg" width="100%" alt="Progress card for HTMLForm">

</div>

Two inputs, name and last name. **Send** doesn't reload the page; it adds a list item with the time, the values as a JSON string and a pretty-printed copy.

## ▶️ How to run

Open `index.html` in a browser, or run `npm run dev` from the repository root and go to `http://localhost:8000/Week4AdvAsynchronousJavaScript/Day3HTTPAndFormMethodGETAndPOST/DailyChallenge/HTMLForm/`.

Ada and Lovelace give:

```
{"name":"Ada","lastname":"Lovelace"}
```

## 🎯 The challenge

| Function | What it does |
|---|---|
| `el(tag, text, className)` | Creates an element with text and a class |
| `appendJsonEntry(obj)` | Adds an `<li>` with `Submitted at <time>`, `JSON.stringify(obj)` and the pretty JSON |
| submit handler | Calls `preventDefault()`, reads the `FormData` and builds `{ name, lastname }` |

**Clear Output** empties the list. The form has `novalidate`, so empty fields go through as `""`.

## 🧠 What I learned

- Without `preventDefault()` the submit reloads the page and the log disappears
- `Object.fromEntries(data.entries())` turns a `FormData` into a plain object
- `JSON.stringify(obj, null, 2)` adds line breaks and a two-space indent

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 4 Day 3 - HTTP and GET/POST Forms - Daily Challenge
