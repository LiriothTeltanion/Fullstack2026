# 🥷 Exercises XP Ninja

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xpninja-a856c80b40.svg" width="100%" alt="Progress card for Exercises XPNinja">

</div>

`mergeWords` builds a sentence one call at a time. Every call with a word adds it, and an empty call `()` hands back the finished sentence.

## ▶️ How to run

`index.js` uses `module.exports` and `require.main`, but the repo root `package.json` has `"type": "module"`, so `node index.js` stops with `module is not defined`. A `.cjs` copy runs:

```powershell
Copy-Item index.js $env:TEMP\merge.cjs; node $env:TEMP\merge.cjs
```

```bash
cp index.js /tmp/merge.cjs && node /tmp/merge.cjs
```

```
Hello
There is no spoon.

one two three
```

That empty line is `mergeWords()()`, which returns an empty string.

## 🎯 The challenge

- `mergeWords(first)` starts an accumulator `acc` with the first word.
- It returns `chain(next)`. Given a word, `chain` adds it to `acc` with one space and returns itself. Given nothing, it returns `acc`.
- So `mergeWords('There')('is')('no')('spoon.')()` gives `There is no spoon.`

## 🧠 What I learned

- Returning `chain` from inside `chain` is what makes the calls go on as long as I want
- `acc` survives between calls because `chain` closes over it
- `next === undefined` is the signal to stop and return the sentence
- `acc ? " " + next : next` avoids a space at the start when the first word is missing

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 3 Day 4 - Advanced JavaScript Functions - Exercises XP Ninja
