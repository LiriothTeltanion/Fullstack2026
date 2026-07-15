# Exercises XP — Node.js Modules & FS

<!-- NOVA:ULTIMATE:START -->
<div align="center">

<img src="../../../../assets/readme/nova-folder-pulse.svg" width="100%" alt="Animated NOVA learning pulse">

### Exercises XP

<img src="../../../../assets/readme/progress/exercises-xp-33f9f32714.svg" width="100%" alt="Readiness status for Exercises XP">

**Goal:** Practice relational modeling, safe queries, joins, constraints, and persistent data workflows.

</div>

## 🧭 NOVA Folder Guide

| Metric | Value |
|---|---:|
| Readiness | **80%** |
| Files | 33 |
| Source files | 13 |
| Test files | 0 |
| Text lines | 765 |

### ▶️ Main paths

- `Week6DatabasesAndNodejs/Day4NodejsIntroduction/Exercises/ExercisesXP/exercise-1-commonjs-products/package.json`
- `Week6DatabasesAndNodejs/Day4NodejsIntroduction/Exercises/ExercisesXP/exercise-2-esm-average-age/app.js`
- `Week6DatabasesAndNodejs/Day4NodejsIntroduction/Exercises/ExercisesXP/exercise-2-esm-average-age/package.json`
- `Week6DatabasesAndNodejs/Day4NodejsIntroduction/Exercises/ExercisesXP/exercise-3-file-manager-commonjs/app.js`
- `Week6DatabasesAndNodejs/Day4NodejsIntroduction/Exercises/ExercisesXP/exercise-3-file-manager-commonjs/package.json`
- `Week6DatabasesAndNodejs/Day4NodejsIntroduction/Exercises/ExercisesXP/exercise-4-esm-todo/todoApp/app.js`

### 🚀 Run

```bash
node Week6DatabasesAndNodejs/Day4NodejsIntroduction/Exercises/ExercisesXP/exercise-2-esm-average-age/app.js
```

### 🟢 What is already strong

- ✅ README documentation is generated and repeatable.
- ✅ Contains 13 source file(s) across practical exercises or projects.
- ✅ No Python syntax error was detected in this folder tree.
- ✅ A likely runnable entry point was detected.

### 🟠 What to improve next

- ⚠️ No local unit test is present yet; repository-wide syntax checks still cover the sources.

### 🧪 Validation

```bash
python tools/nova_quality_gate.py --repo . --strict
python -m unittest discover -s tests/python -p "test_*.py" -v
node tools/run_node_tests.mjs .
```

> The readiness value is a transparent repository heuristic, not a course grade and not proof that every interactive or external-API exercise was executed.

<sub>Managed by NOVA Ultimate v2.0.0 · 2026-07-15T06:22:49+03:00</sub>
<!-- NOVA:ULTIMATE:END -->

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
