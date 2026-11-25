# 💪 Daily Challenge - Go Wildcats

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/go-wildcats-a2d75a34e0.svg" width="100%" alt="Progress card for Go Wildcats">

</div>

Four players, their teams and scores. With `forEach` I build the usernames with `!`, the list of winners and the total score.

## ▶️ How to run

From this folder:

```bash
npx tsc GoWildcats.ts --module commonjs --outDir ~/tmp-ts
node ~/tmp-ts/GoWildcats.js
```

The demo block only runs as CommonJS (`require.main === module`), and inside this repository `.js` files are ES modules, so I compile it to a folder outside the repo first.

```
usernames: [ 'john!', 'becky!', 'susy!', 'tyson!' ]
winners: [ 'becky', 'susy' ]
totalScore: 71
```

## 🎯 The challenge

1. **`usernames`** — every username with an exclamation mark at the end.
2. **`winners`** — the usernames of players with a score above 5.
3. **`totalScore`** — the sum of all scores.

Each part uses `forEach` and pushes into an array or adds to a counter. A comment at the end shows the same results with `map`, `filter` and `reduce`.

## 🧠 What I learned

- `forEach` returns nothing, so I fill an outer array or variable
- `map`, `filter` and `reduce` do the same jobs in one line each
- A `type` for the player objects catches typos in property names

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 4 Day 1 - Advanced Array Methods - Daily Challenge
