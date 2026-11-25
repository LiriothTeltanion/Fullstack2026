# 💪 Daily Challenge - Library System

<div align="center">

<img src="../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../assets/readme/progress/daily-challenge-018a6493ca.svg" width="100%" alt="Progress card for Daily Challenge">

</div>

A tiny library in one TypeScript file. Books follow a `Book` interface, a `Library` class keeps them by ISBN, and `DigitalLibrary` extends it with a website and a list of titles.

## ▶️ How to run

From this folder:

```bash
npx tsc LibrarySystem.ts --module commonjs --outDir ~/tmp-ts
node ~/tmp-ts/LibrarySystem.js
```

The demo only runs when the file is executed as CommonJS (`require.main === module`). This repository treats `.js` as ES modules, so I compile into a folder outside it first.

```
Title: Clean Code | Author: Robert C. Martin | ISBN: 9780132350884 | Year: 2008 | Genre: Software Engineering
Title: The Pragmatic Programmer | Author: Andrew Hunt, David Thomas | ISBN: 9780201616224 | Year: 1999
Title: You Don't Know JS Yet | Author: Kyle Simpson | ISBN: 9781098124045 | Year: 2020 | Genre: JavaScript
Book not found.
All book titles: [ 'Clean Code', 'The Pragmatic Programmer', "You Don't Know JS Yet" ]
Digital Library website: https://library.example.com
```

## 🎯 The challenge

| Part | What it does |
|---|---|
| `interface Book` | `title`, `author`, `isbn`, `publishedYear` and an optional `genre` |
| `Library.addBook(book)` | Uses `findIndex` on the ISBN: replaces a match, otherwise pushes the new book |
| `Library.getBookDetails(isbn)` | One formatted line, or `Book not found.` |
| `Library.getAllBooks()` | `protected` and returns a `ReadonlyArray<Book>`, so a subclass can read the private list but not change it |
| `DigitalLibrary` | A `readonly website` set in the constructor, and `listBooks()`, which maps the books to their titles |

The Pragmatic Programmer has no genre, which is why its line in the output ends at the year.

## 🧠 What I learned

- Keeping `books` `private` means the only way in is through `addBook()`
- A `protected` getter is the bridge that lets `DigitalLibrary` see the list without making it public
- Returning `ReadonlyArray` stops a subclass from pushing into the list behind `addBook()`'s back
- `genre?` can be missing, so I build the ` | Genre: …` part only when it exists

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 5 Day 3 - Advanced TypeScript Concepts and Applications - Daily Challenge
