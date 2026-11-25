# 🧪 Exercise - Login Page

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/login-page-2c7a1a7f11.svg" width="100%" alt="Progress card for Login Page">

</div>

A login card for a made-up site called Study Hub. The browser does the validation with plain HTML attributes, and a small [app.js](app.js) adds a show/hide password button and a friendly message instead of a real submit, because there is no server behind it.

## ▶️ How to run

Open [index.html](index.html). Try an empty form, a bad email or a 5-character password to see the browser stop it.

## 🎯 The challenge

| Piece | How it works |
|---|---|
| Email | `type="email"`, `required`, `autocomplete="email"` |
| Password | `minlength="8"`, `required`, `autocomplete="current-password"`, and a hint linked with `aria-describedby` |
| Show / Hide | A `button type="button"` that flips the input between `password` and `text` and updates `aria-pressed` |
| Error style | `input:user-invalid` turns the border red, but only after the user has typed |
| Submit | `event.preventDefault()`, then a message in a `role="status"` paragraph, then `form.reset()` |

The page is one centered card (`display: grid; place-items: center` on the body) over a soft pastel gradient.

## 🧠 What I learned

- `required`, `type="email"` and `minlength` give real validation before any JavaScript runs
- `:user-invalid` is kinder than `:invalid`, which paints the form red before I've typed anything
- A button inside a form submits by default, so the toggle needs `type="button"`
- Sending a password with a GET form would put it in the URL, which is one more reason the demo stops the submit

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 13 Day 2 - Git and GitHub - Exercise
