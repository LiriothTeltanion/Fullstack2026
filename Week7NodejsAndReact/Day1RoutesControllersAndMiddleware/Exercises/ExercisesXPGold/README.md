# 🥇 Exercises XP Gold

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xp-gold-84f0ce2f85.svg" width="100%" alt="Progress card for Exercises XP Gold">

</div>

A posts API where the interesting part is the middleware: one runs on every request, two guard single routes, and two sit at the end for 404s and errors.

## ▶️ How to run

```bash
npm install
cp .env.example .env   # set API_KEY to any value
npm run dev
```

Sample requests and what the server answered when I ran it (with `API_KEY=secret123`):

```bash
curl -X POST -H "Content-Type: application/json" -d '{"title":"Hi"}' http://localhost:3000/posts
curl -X DELETE http://localhost:3000/posts/1
curl -X DELETE -H "x-api-key: secret123" http://localhost:3000/posts/1
curl http://localhost:3000/broken
```

```
{"errors":["title must have at least 3 characters","content is required"]}
{"error":"Missing or wrong x-api-key header"}
{"message":"Post deleted"}
{"error":"Something broke on purpose"}
```

The terminal shows one line per request, for example `POST /posts -> 400 (1 ms)`.

## 🎯 The challenge

| Middleware | Where it runs | What it does |
|---|---|---|
| `requestTime` | every request | Saves `req.requestTime`, logs method, URL, status and milliseconds when the response finishes |
| `validatePost` | `POST` and `PUT /posts` | Returns 400 with a list of errors when `title` or `content` is wrong |
| `checkApiKey` | `DELETE /posts/:id` | Returns 401 unless the `x-api-key` header equals `API_KEY` |
| `notFound` | after all routes | JSON 404 for unknown URLs |
| `errorHandler` | last | Catches thrown errors and `next(error)`, uses `err.status` or 500 |

`GET /time` shows the value `requestTime` added, and `GET /broken` throws on purpose to test the error handler.

## 🧠 What I learned

- A route can take several functions: `router.post("/", validatePost, createPost)` runs them left to right
- `res.on("finish")` is the place to log the final status code, because it is not known before the handler runs
- `next(error)` skips the normal handlers and jumps straight to the four-argument error handler
- The API key comes from `.env` through `dotenv`, so the real value never goes into the code

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 7 Day 1 - Routes, Controllers and Middleware - Exercises XP Gold
