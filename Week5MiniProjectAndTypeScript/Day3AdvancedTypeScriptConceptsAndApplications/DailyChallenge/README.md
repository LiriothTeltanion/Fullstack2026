# 💪 Daily Challenge - Library System

<div align="center">

<img src="../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../assets/readme/progress/daily-challenge-018a6493ca.svg" width="100%" alt="Progress card for Daily Challenge">

</div>

A small library system in TypeScript: a `Book` interface, a `Library` class that stores books by ISBN and a `DigitalLibrary` subclass with a website and a list of titles.

## ▶️ How to run

From this folder:

```bash
npx tsc LibrarySystem.ts --module commonjs --outDir ~/tmp-ts
node ~/tmp-ts/LibrarySystem.js
```

The demo block only runs as CommonJS (`require.main === module`), and inside this repository `.js` files are ES modules, so I compile it to a folder outside the repo first.

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
| `Library.addBook(book)` | Adds a book, or replaces the one with the same ISBN |
| `Library.getBookDetails(isbn)` | Returns one formatted line, or `Book not found.` |
| `Library.getAllBooks()` | `protected`, so only subclasses can read the private list |
| `DigitalLibrary` | Adds a `readonly website` and `listBooks()`, which returns all titles |

## 🧠 What I learned

- A `private` array keeps the list safe from outside changes
- `protected` lets a subclass read data without making it public
- An optional property (`genre?`) needs a check before I use it

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 5 Day 3 - Advanced TypeScript Concepts and Applications - Daily Challenge
