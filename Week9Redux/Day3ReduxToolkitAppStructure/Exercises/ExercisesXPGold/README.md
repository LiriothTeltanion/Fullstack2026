# 🥇 Exercises XP Gold

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xp-gold-86538d6c64.svg" width="100%" alt="Progress card for Exercises XP Gold">

</div>

A book inventory with a genre filter. The books and the chosen genre live in two slices, and the list on screen comes from memoized selectors built with `createSelector`.

## ▶️ How to run

```bash
npm install
npm run dev
```

## 🎯 The challenge

1. **Books slice.** Five starting books, `bookAdded` (with a `prepare` callback for the id) and `bookRemoved`.
2. **Filters slice.** `filtersSlice` only stores `genre`, changed by `genreChanged`.
3. **Memoized selectors.** `selectVisibleBooks` filters by genre, `selectGenres` builds the button list from the books, and `selectCountByGenre` counts books per genre.
4. **Components.** `BookList` shows the genre buttons with their counts and the filtered list. `BookForm` adds a book, and a new genre gets its own button right away.

## 🧠 What I learned

- A selector that returns `filter(...)` makes a new array on every call, and `createSelector` stops that by reusing the last result while the inputs stay the same
- The genre list is derived from the books, so adding a book with a new genre needs no extra action
- Two small slices are easier to follow than one slice that mixes data and UI filters
- A selector can read from two slices at once, which a slice reducer can't do

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 9 Day 3 - Redux Toolkit App Structure - Exercises XP Gold
