# 🧪 Exercise 1 - Timer

<div align="center">

<img src="../../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../../assets/readme/progress/exercise1-timer-2c9c28cd61.svg" width="100%" alt="Progress card for Exercise1 timer">

</div>

The same three-part timer task as on Day 3, done again for the remote session: an alert after 2 seconds, a paragraph after 2 seconds, and then a new paragraph every 2 seconds until something stops it.

## ▶️ How to run

Open `index.html` in a browser (or run `npm run dev` from the repo root and open this folder at `http://localhost:8000/`). The timers start on load. `js/app.js` needs the page, so it does not run with `node`.

## 🎯 The challenge

1. **Part I**: `setTimeout` shows `alert("Hello World")` after 2 seconds.
2. **Part II**: another `setTimeout` adds `<p>Hello World</p>` to `#container` after 2 seconds.
3. **Part III**: `setInterval` adds a paragraph every 2 seconds and stops at 5 paragraphs, or earlier if I click **Clear Interval**.

This time I pulled the paragraph code into `addParagraph(text)`, so Parts II and III share it.

## 🧠 What I learned

- Two `setTimeout` calls with the same 2000 ms delay fire one after the other, in the order I wrote them
- `clearInterval` only works with the id that `setInterval` gave back, so I keep it in `intervalId`
- Setting `intervalId = null` after clearing makes a second click on the button do nothing
- Counting `container.querySelectorAll("p")` tells the interval when it's time to stop

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 3 Remote Learning - JavaScript and the DOM - Exercise 1
