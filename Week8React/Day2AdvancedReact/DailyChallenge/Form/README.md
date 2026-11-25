# 💪 Daily Challenge - Form

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/form-25fc858ae4.svg" width="100%" alt="Progress card for Form">

</div>

A sign-up form with client-side validation. Errors show only after I leave a field (or press "Sign up"), and a valid form resets and greets the new user.

## ▶️ How to run

```bash
npm install
npm run dev
```

Vite prints a local address (usually `http://localhost:5173`); I open it in the browser.

## 🎯 The challenge

| Part | What it does |
|---|---|
| `validate(values)` | In `src/validate.js`. Returns one message per broken rule: username under 3 characters, an email that fails the regex, a password without 8 characters and a digit, a confirmation that does not match, terms not accepted |
| `SignUpForm` | Keeps `values`, `touched` and `submitted` in state. Errors are recalculated on every render; `show(name)` hides them until the field was touched |
| `Field` | A reusable label, input and error message, with `aria-invalid` so a broken field gets a red border |

## 🧠 What I learned

- Errors do not need their own state when I can calculate them from the values
- A `touched` object stops the form from shouting at the user before they type
- `noValidate` turns off the browser bubbles so my own messages are the only ones
- Pulling the input markup into `Field` removed a lot of repeated JSX

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 8 Day 2 - Advanced React - Daily Challenge
