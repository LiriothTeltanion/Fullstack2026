# 💪 Daily Challenge - Tell the Story

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/tell-the-story-cd3ae5ebb9.svg" width="100%" alt="Progress card for Tell The Story">

</div>

Mad Libs in the browser. I fill in a noun, an adjective, a name, a verb and a place, and the page turns them into a short story.

## ▶️ How to run

Open `index.html` in a browser (or use `npm run dev` from the repo root). Fill every field and click **Lib it!**. **Shuffle story** picks another template with the same words, and **Reset** clears everything.

```
Kevin dances a shiny dragon in Ramat Gan. Everyone cheered!
```

## 🎯 The challenge

| Function | What it does |
|---|---|
| `readValues()` | Reads the five inputs and trims them. |
| `validate(values)` | Returns the first empty field, or `null`. |
| `buildStory(words)` | Picks one of 4 template functions at random, avoids repeating the last one, and writes the story into `#story`. |

On `submit` I call `preventDefault()` first. If a field is empty, an alert says which one (`Please fill the noun.`) and that field gets the focus. Once a story exists, the Shuffle button is enabled.

More notes are in [README_MadLibs.md](README_MadLibs.md).

## 🧠 What I learned

- Without `preventDefault()` the form would reload the page and the story would be gone
- Each template is an arrow function that destructures the five words, so every story is one line
- `lastIdx` remembers the last template, which stops Shuffle from showing the same story twice in a row
- Calling `.focus()` on the empty field sends the cursor straight to what needs fixing

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 3 Day 3 - DOM Events - Daily Challenge
