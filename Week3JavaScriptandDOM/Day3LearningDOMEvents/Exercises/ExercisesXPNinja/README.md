# Exercises XP Ninja — DOM, Events, Forms

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xpninja-c8db0eb93d.svg" width="100%" alt="Progress card for Exercises XPNinja">

</div>

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
