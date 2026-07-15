# Exercises XP Ninja — DOM, Events, Forms

<!-- NOVA:ULTIMATE:START -->
<div align="center">

<img src="../../../../assets/readme/nova-folder-pulse.svg" width="100%" alt="Animated NOVA learning pulse">

### Exercises XPNinja

<img src="../../../../assets/readme/progress/exercises-xpninja-c8db0eb93d.svg" width="100%" alt="Readiness status for Exercises XPNinja">

**Goal:** Create interactive browser experiences with JavaScript, DOM events, accessibility, and responsive behavior.

</div>

## 🧭 NOVA Folder Guide

| Metric | Value |
|---|---:|
| Readiness | **80%** |
| Files | 4 |
| Source files | 2 |
| Test files | 0 |
| Text lines | 263 |

### ▶️ Main paths

- `Week3JavaScriptandDOM/Day3LearningDOMEvents/Exercises/ExercisesXPNinja/index.html`
- `Week3JavaScriptandDOM/Day3LearningDOMEvents/Exercises/ExercisesXPNinja/main.js`

### 🚀 Run

```bash
python -m http.server 8000
node Week3JavaScriptandDOM/Day3LearningDOMEvents/Exercises/ExercisesXPNinja/main.js
```

### 🟢 What is already strong

- ✅ README documentation is generated and repeatable.
- ✅ Contains 2 source file(s) across practical exercises or projects.
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

**Last Updated:** October 7th, 2025

## What we will learn
- Working with the DOM 🧩
- Event Handlers 🖱️
- Forms 📝

---

## Files
- `index.html` — three sections for the exercises, loads `main.js`.
- `main.js` — implementations with friendly comments.

---

## Run
Open `index.html` in a browser.

---

## Exercises

### 1) Calculate the tip 🍽️
- IDs used (as required): `billAmt`, `serviceQual`, `numOfPeople`, `each`, `totalTip`, `tip`, `calculate`.
- `calculateTip()`:
  - Prompts for values, validates inputs (alerts if missing/zero).  
  - Defaults `numOfPeople` to 1 and hides “each” when appropriate.  
  - Computes `(billAmount * serviceQuality) / numberOfPeople`, rounds to **2** decimals, shows the result.  
- `#totalTip` is hidden by default and shown only after calculation.  
- Button `#calculate` uses **onclick** to call `calculateTip()`.

### 2) Validate the email 📧
- Enter an email, choose validation method (No-Regex or Regex), then **Check**.  
- No-Regex: structural checks (one `@`, domain has `.`, basic allowed characters).  
- Regex: `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/`.

### 3) Get the user’s geolocation 📍
- Click **Get Coordinates** to read via `navigator.geolocation.getCurrentPosition`.  
- Displays latitude and longitude, or an error message.

---

## Notes
- This project is self-contained (no frameworks).  
- Works in any modern browser with the Geolocation API enabled. 🌍
