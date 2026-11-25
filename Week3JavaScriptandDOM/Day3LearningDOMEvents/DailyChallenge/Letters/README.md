# Daily Challenge: Letters ✍️

**Last Updated:** October 7th, 2025

## 🌟 Goal
Create a text input that **accepts and shows only letters**. Any numbers or special characters are removed via JavaScript events.

## 🧰 What you’ll use
- DOM manipulation
- Forms
- Event listeners (`input`, optionally `keydown`)

---

## ▶️ Run
Open `index.html` in a browser.  
Type into the field — non-letter characters will be stripped automatically. ✨

---

## 📝 How it works
- Listens to the **`input`** event and sanitizes the field using a regex: `/[^a-z]/gi`.
- Replaces any non-letter with `""` and tries to preserve the caret position.
- Optional **`keydown`** handler (commented) shows how to proactively block disallowed keystrokes. Paste/drag cases are still handled by the `input` listener.

---

## 📦 Files
- `index.html` — minimal page & form.
- `main.js` — logic with small comments and helpful feedback.
