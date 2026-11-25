# 🥷 Exercises XP Ninja

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xpninja-c8db0eb93d.svg" width="100%" alt="Progress card for Exercises XPNinja">

</div>

Three exercises with forms and events: a tip calculator, an email checker with and without a regex, and the browser's geolocation.

## ▶️ How to run

Open `index.html` in a browser (or use `npm run dev` from the repo root). Exercise 3 asks for permission to read your location.

## 🎯 The challenge

| Function | What it does |
|---|---|
| `calculateTip()` | Reads the bill, the service quality and the number of people from the page, alerts when the bill or quality is missing, uses 1 person by default, and shows `(bill × quality) ÷ people` with 2 decimals. The word "each" appears only for more than one person. |
| `isValidEmailNoRegex(value)` | Checks for one `@`, a non-empty name and a domain with a `.`, then allowed characters. |
| `isValidEmailRegex(value)` | Tests `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/`. |
| `getGeolocation()` | Calls `navigator.geolocation.getCurrentPosition` and prints the latitude and longitude, or the error message. |

The email form shows `✅ Looks like a valid email.` or `❌ Invalid email format.` for the method chosen with the radio buttons. The `#totalTip` block stays hidden until the first calculation.

## 🧠 What I learned

- `parseFloat` and `Number.isFinite` catch empty or wrong number inputs
- `new FormData(form).get("method")` reads the checked radio button
- Checking an email without a regex means splitting it at `@` and testing each part
- Geolocation is asynchronous: the answer arrives later in a callback

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 3 Day 3 - DOM Events - Exercises XP Ninja
