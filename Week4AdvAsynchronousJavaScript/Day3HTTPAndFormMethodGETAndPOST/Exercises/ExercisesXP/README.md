# Exercises XP — HTTP & Forms (GET, POST, JSON)

<!-- NOVA:ULTIMATE:START -->
<div align="center">

<img src="../../../../assets/readme/nova-folder-pulse.svg" width="100%" alt="Animated NOVA learning pulse">

### Exercises XP

<img src="../../../../assets/readme/progress/exercises-xp-200dd1c988.svg" width="100%" alt="Readiness status for Exercises XP">

**Goal:** Build resilient asynchronous flows with HTTP requests, loading states, validation, and error handling.

</div>

## 🧭 NOVA Folder Guide

| Metric | Value |
|---|---:|
| Readiness | **80%** |
| Files | 5 |
| Source files | 3 |
| Test files | 0 |
| Text lines | 283 |

### ▶️ Main paths

- `Week4AdvAsynchronousJavaScript/Day3HTTPAndFormMethodGETAndPOST/Exercises/ExercisesXP/app.js`
- `Week4AdvAsynchronousJavaScript/Day3HTTPAndFormMethodGETAndPOST/Exercises/ExercisesXP/index.html`

### 🚀 Run

```bash
node Week4AdvAsynchronousJavaScript/Day3HTTPAndFormMethodGETAndPOST/Exercises/ExercisesXP/app.js
python -m http.server 8000
```

### 🟢 What is already strong

- ✅ README documentation is generated and repeatable.
- ✅ Contains 3 source file(s) across practical exercises or projects.
- ✅ No Python syntax error was detected in this folder tree.
- ✅ A likely runnable entry point was detected.

### 🟠 What to improve next

- ⚠️ No local unit test is present yet; repository-wide syntax checks still cover the sources.

### 🧪 Validation

```bash
python tools/nova_quality_gate.py --repo . --strict
python -m unittest discover -s tests/python -p "test_*.py" -v
node tools/run_node_tests.mjs .
```

> The readiness value is a transparent repository heuristic, not a course grade and not proof that every interactive or external-API exercise was executed.

<sub>Managed by NOVA Ultimate v2.0.0 · 2026-07-15T06:22:49+03:00</sub>
<!-- NOVA:ULTIMATE:END -->

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
