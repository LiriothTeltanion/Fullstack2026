# 📚 Daily Challenge - Book List

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

A typed React book list that starts with three fictional records and lets me add books.

## ▶️ How to run

From this folder:

```bash
npm install
npm run dev
```

`npm run build` performs strict TypeScript checking and creates a production build.

## How it works

- `Book` declares `id`, `title` and `author`.
- `List<T>` receives `items` and `renderItem`, so it can render values of any item type.
- `BookApp` stores its books in `useState<Book[]>` and preloads three fictional records.
- The form trims both fields, rejects blanks and appends a new book with a unique numeric ID.
- The functional state update computes the ID from the latest collection.
- The list only appends items, so its positional keys remain stable.

The original TypeScriptReactTodo exercise remains beside this folder. This book-list implementation covers the Book and generic List requirements of the chapter.

The list lives in component state and resets on reload.

Created 2026-11-25, Asia/Jerusalem.
