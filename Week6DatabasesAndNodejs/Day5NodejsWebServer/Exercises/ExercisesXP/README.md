# 🥉 Exercises XP

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xp-c99055f596.svg" width="100%" alt="Progress card for Exercises XP">

</div>

Three Express exercises share one listener: a blog CRUD API, a book list/create/read API, and an Axios data-service route. The earlier five built-in HTTP servers remain available under their existing filenames and npm scripts.

## Run the Express exercises

Run npm install and npm start, then request http://localhost:3000/posts or http://localhost:3000/api/books. PORT selects another port. Data lives in memory and resets when the process restarts.

| Route | Behavior |
|---|---|
| GET /posts | List blog posts |
| GET /posts/:id | Read a post or 404 |
| POST /posts | Create with a non-empty title and content; returns 201 |
| PUT /posts/:id | Replace the title and content |
| DELETE /posts/:id | Remove a post; returns 204 |
| GET /api/books | List books |
| GET /api/books/:bookId | Read a book or 404 |
| POST /api/books | Create with title, author and optional integer publishedYear |
| GET /external-posts | Call data/dataService.js and return JSONPlaceholder posts, or 502 if the service fails |

The app factory creates fresh arrays and monotonic ids. Express parses JSON and returns 400 for malformed bodies or invalid fields. data/dataService.js exports fetchPosts(), which uses Axios and a five-second timeout.

## Verification · 2026-11-25

Run npm test for CRUD, book requests, invalid input, malformed JSON and the external-service success/failure fixtures. Tests use temporary loopback ports and a deterministic Axios-compatible fixture. A separate live smoke check returned 100 posts from JSONPlaceholder.

The external-posts URL keeps the remote-data exercise separate from the local blog's /posts. All three routes run in the same Express app.

## Retained built-in HTTP practice

The following original notes describe the earlier five standalone servers. They can still run with npm run ex1 through npm run ex5. Use a different PORT when also running the Express listener.

Five web servers that build on each other, from plain text to JSON routes, a file from disk and my own module. Only Node's `http` module, nothing to install.

## ▶️ How to run

Each server has its own port, so they can run side by side:

```bash
node ex1-hello-server.js   # http://localhost:3000
node ex2-html-server.js    # http://localhost:3001
node ex3-json-routes.js    # http://localhost:3002
node ex4-static-page.js    # http://localhost:3003
node ex5-date-server.js    # http://localhost:3004
```

What `curl` got back from Exercise 3:

```
GET /api/users -> 200 [{"id":1,"name":"Dana","role":"student"},{"id":2,"name":"Omer","role":"mentor"}]
GET /nope      -> 404 {"error":"No route for /nope"}
```

## 🎯 The challenge

1. [ex1-hello-server.js](ex1-hello-server.js): `http.createServer()` answers plain text with the URL that was asked for.
2. [ex2-html-server.js](ex2-html-server.js): the same, but an HTML string with `Content-Type: text/html`.
3. [ex3-json-routes.js](ex3-json-routes.js): a `switch` on `req.url` for `/`, `/about` and `/api/users`, 404 for anything else and 405 for methods other than GET.
4. [ex4-static-page.js](ex4-static-page.js): reads [public/index.html](public/index.html) with `fs/promises` on every request and answers 500 if the file is missing.
5. [ex5-date-server.js](ex5-date-server.js): imports `formatNow()` and `daysUntil()` from [dateUtils.js](dateUtils.js) and prints the date and the days left to New Year and to 1 April.

## 🧠 What I learned

- Without the right `Content-Type`, the browser shows HTML as plain text
- `res.end()` is what finishes the response; forgetting it leaves the browser loading forever
- A `sendJson()` helper removed the same two lines from every route
- `Number(process.env.PORT) || 3000` lets me change the port without touching the code

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 6 Day 5 - Node.js Web Server - Exercises XP
