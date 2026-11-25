# 🎮 Mini Project - Sign In Form

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/mini-project-createa-sign-in-form-ba63e6bf9c.svg" width="100%" alt="Progress card for Mini Project Createa Sign In Form">

</div>

A Sign In form and a Sign Up form sit side by side, and a red panel covers one of them. The button on the panel slides it across and shows the other form.

## ▶️ How to run

Open `index.html` in a browser (or run `npm run dev` from the repo root and open this folder at `http://localhost:8000/`). `js/app.js` needs `document`, so it only works in the browser, not with `node`.

## 🎯 The challenge

| Function | What it does |
|---|---|
| `setState(mode)` | Sets `data-state` to `signin` or `signup` on the container, updates `aria-hidden` and `aria-pressed`, then focuses the first field of the visible form. |
| `focusFirstInput(section)` | Focuses the first input or button inside a section. |
| `handleDemoSubmit(e)` | Stops the real submit, shows the browser's validation messages when a field is wrong, and otherwise alerts `Form submitted successfully! (Demo)`. |

- The **Log In** and **Create Account** buttons on the panel call `setState()`.
- `Ctrl + ←` or `Ctrl + →` switches forms from the keyboard.
- The CSS slides the panel with `transform` depending on `data-state`. The slide is off for people who ask for reduced motion, and under 860px everything stacks in one column.

There is no real sign-in behind it. Both forms end in a demo alert.

## 🧠 What I learned

- The JavaScript only flips one `data-state` attribute, and the CSS does the whole animation from it
- `checkValidity()` and `reportValidity()` reuse the `required` and `minlength` rules I already wrote in the HTML
- `aria-hidden` and `aria-pressed` let a screen reader know which form is showing
- The focus moves inside a 120 ms `setTimeout`, not at the same instant as the click

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 3 Day 3 - DOM Events - Mini Project
