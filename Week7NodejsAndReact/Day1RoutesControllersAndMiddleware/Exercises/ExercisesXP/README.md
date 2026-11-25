# 🥉 Exercises XP

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xp-51674a7a2e.svg" width="100%" alt="Progress card for Exercises XP">

</div>

Three small routers on one Express server: two HTML pages, a todo API and a books API. Every router only maps URLs, and the logic sits in `controllers/`.

## ▶️ How to run

```bash
npm install
cp .env.example .env   # optional: it only sets PORT, 3000 by default
npm run dev
```

Then try the routes (the port comes from `PORT`, default 3000):

```bash
curl http://localhost:3000/about
curl -X POST -H "Content-Type: application/json" -d '{"title":"Write the README"}' http://localhost:3000/todos
```

```
<h1>About Us</h1><p>A small app built with express.Router().</p>
{"id":3,"title":"Write the README","completed":false}
```

## 🎯 The challenge

1. **Basic router** (`routes/index.js`): `GET /` and `GET /about` send two small HTML pages.
2. **Todo API** (`routes/todos.js` + `controllers/todosController.js`): `GET /todos`, `POST /todos`, `PUT /todos/:id` and `DELETE /todos/:id` on an in-memory array.
3. **Books API** (`routes/books.js` + `controllers/booksController.js`): the same CRUD for books plus `GET /books/:id`. A missing book returns `404 {"error":"Book not found"}` and a delete returns `204`.

`middleware/logger.js` prints `METHOD /url` for every request, and a last `app.use()` answers unknown routes with a JSON 404.

## 🧠 What I learned

- `express.Router()` lets each file own one resource, and `app.use("/todos", todosRouter)` adds the prefix
- Splitting routes and controllers keeps the route files to a handful of lines
- `Number(req.params.id)` matters, because params are strings and `1 === "1"` is false
- The data lives in memory, so a restart brings the seed todos and books back
- `express-rate-limit` in front of every route allows each IP 100 requests per 15 minutes and answers 429 after that, so one client can't flood the server

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 7 Day 1 - Routes, Controllers and Middleware - Exercises XP
