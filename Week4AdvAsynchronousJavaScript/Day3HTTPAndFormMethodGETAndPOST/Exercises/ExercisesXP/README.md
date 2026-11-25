# Exercises XP — HTTP & Forms (GET, POST, JSON)

A tiny, beginner-friendly demo for the bootcamp exercises.

## ⭐ Exercise 1: HTML Form (GET)
- Form uses `method="GET"` and same page as `action`.
- When you click **Send**, the data appears in the **URL** after the `?`.
- I also parse the URL with JS and show it as JSON on the page.

**Where does the data appear?**  
→ In the URL query string (example: `?name=Mario&message=Hello`).

## ⭐ Exercise 2: HTML Form #2 (POST)
- Form uses `method="POST"` and same page as `action`.
- Data does **not** appear in the URL. It goes into the **request body**.

**Where does the data appear?**  
→ Open **DevTools → Network**, click the request, check **Payload / Form Data**.

> Tip: Run a tiny local server so the POST shows up in Network:
```bash
# Option 1 (Python 3)
python -m http.server 8000

# Option 2 (Node)
npx http-server -p 8000
```
Then open `http://localhost:8000/` and submit the POST form.

## ⭐ Exercise 3: JSON Mario
- Convert the `marioGame` JS object to JSON using `JSON.stringify`.
- Pretty print with spaces: `JSON.stringify(marioGame, null, 2)`.
- Click **Make JSON (with debugger)** to pause in DevTools and inspect variables.

**What happens to nested objects?**  
→ They remain **nested** in the JSON structure (just represented as text).

## Files
- `index.html` — the page with the three sections
- `style.css` — minimal styling
- `app.js` — simple logic with small comments

## How to run
- For GET only: just open `index.html` (double-click).
- For POST + Network tab: run a local server and open `http://localhost:8000/`.

Enjoy and keep it simple!
