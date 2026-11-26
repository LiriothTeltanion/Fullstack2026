# 💪 Daily Challenge - Voting App

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/voting-app-63cef48748.svg" width="100%" alt="Progress card for Voting App">

</div>

"Vote Your Language": four languages (Php, Python, JavaScript and Java), each with a button that adds a vote. The counts, a percentage bar and the current leader all update from one piece of state.

## ▶️ How to run

```bash
npm install
npm run dev
```

Open the address Vite prints (usually http://localhost:5173).

## 🎯 The challenge

| Part | What it does |
|---|---|
| `App.jsx` | Holds the `languages` array in `useState`, plus `addVote(name)`, the total and the top score |
| `components/LanguageRow.jsx` | Shows one language with its votes and bar, and calls `onVote` when the button is clicked |
| Reset button | Puts the starting array back; it is disabled while there are no votes |

The leader (or leaders, on a tie) gets a green outline, and the bars show each language's share of all votes.

The result also includes a numeric percentage and the text **Leading** or **Tied for lead**. Each vote button has a language-specific accessible name. The total is announced after voting and resetting. On narrow screens the bar and percentage share a separate line below the vote button.

To check the behavior with a keyboard, press Tab to reach the first vote button and Enter to vote for Php. Tab to Python and press Space. Both should show **50%** and **Tied for lead**. Vote for Python again to see it lead with **67%** and a total of three votes. Reset returns all counts to zero and clears the leader labels.

## 🧠 What I learned

- To change one vote I build a new array with `map()` and a new object with `{ ...lang, votes: lang.votes + 1 }`
- Passing a function to `setLanguages` uses the latest state, even after fast clicks
- The total and the leader are calculated during render, so they never need their own state
- The child only knows `onVote`; it does not care how the parent stores the votes

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 7 Day 5 - React Components and State - Daily Challenge
