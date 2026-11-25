# Exercises XP — Node.js Modules & FS

A tidy set of small Node.js exercises using **CommonJS** and **ES Modules**, plus the `fs` module and a couple of beginner-friendly packages.

> All scripts are commented in ENGLISH and use a few emojis (no hearts) to keep the vibe friendly. ✅💡

## Quickstart

- Use **Node.js 18+**.
- Each exercise lives in its own folder. Run commands inside that folder.
- If a folder has a `package.json` with dependencies, run `npm install` there first.

```bash
# Example
cd exercise-1-commonjs-products
node shop.js
```

## Exercises

### 1) Multiple Exports / Imports with **CommonJS**
`exercise-1-commonjs-products/`
- `products.js` exports an array of product objects via CommonJS.
- `shop.js` imports it and provides an in-name search function.

Run:
```bash
cd exercise-1-commonjs-products
node shop.js
```

---

### 2) Advanced Module Usage with **ES Modules**
`exercise-2-esm-average-age/`
- `data.js` exports `people` (ESM).
- `app.js` imports the array and computes the average age.

Run:
```bash
cd exercise-2-esm-average-age
node app.js
```

---

### 3) File Management with **CommonJS** (`fs`)
`exercise-3-file-manager-commonjs/`
- `fileManager.js` exports `readFile` & `writeFile` (Promise-based).
- `Hello World.txt` and `Bye World.txt` are provided.
- `app.js` reads **Hello World.txt** and overwrites **Bye World.txt** with a new message.

Run:
```bash
cd exercise-3-file-manager-commonjs
node app.js
```

---

### 4) Todo List with **ES Modules**
`exercise-4-esm-todo/todoApp/`
- `todo.js` exports a `TodoList` class.
- `app.js` uses it: add, complete, and list tasks.

Run:
```bash
cd exercise-4-esm-todo/todoApp
node app.js
```

---

### 5) Custom Module + **lodash** in a small app
`exercise-5-math-app/math-app/`
- `math.js` exports `add` & `multiply` (CommonJS).
- `app.js` uses your module + a couple of lodash helpers.
- Includes a `package.json` with lodash as a dependency.

Run:
```bash
cd exercise-5-math-app/math-app
npm install
node app.js
```

---

### 6) Simple NPM Package (chalk) Usage
`exercise-6-npm-beginner-chalk/npm-beginner/`
- Uses **chalk v4** (so we can use `require()` comfortably).
- Prints a colorful message.

Run:
```bash
cd exercise-6-npm-beginner-chalk/npm-beginner
npm install
node app.js
```

---

### 7) Reading & Copying Files
`exercise-7-file-explorer/file-explorer/`
- `copy-file.js` copies contents from `source.txt` to `destination.txt`.
- `read-directory.js` lists the files in the directory.

Run:
```bash
cd exercise-7-file-explorer/file-explorer
node copy-file.js
node read-directory.js
```

## Notes
- Keep Node up to date.
- These demos intentionally keep dependencies minimal.
- Emojis are limited to outputs/comments only (never in identifiers). ✅⚙️
