# 🥷 Exercises XP Ninja

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xp-ninja-cca4dc3b82.svg" width="100%" alt="Progress card for Exercises XP Ninja">

</div>

For the Ninja tier I wrote my own rate limiter instead of installing one, then built a users API with query filters, paging and `router.param()`.

## ▶️ How to run

```bash
npm install
cp .env.example .env   # optional: it only sets PORT, 3000 by default
npm run dev
```

```bash
curl "http://localhost:3000/users?city=tel%20aviv&page=1&limit=2"
```

```
{"page":1,"limit":2,"total":3,"totalPages":2,"data":[{"id":1,"name":"Noa","city":"Tel Aviv"},{"id":3,"name":"Maya","city":"Tel Aviv"}]}
```

After the fifth request inside ten seconds the server answers `429 Too Many Requests` with a `Retry-After: 10` header and `{"error":"Too many requests, try again in 10s"}`.

## 🎯 The challenge

1. **Rate limiter** (`middleware/rateLimit.js`): `rateLimit({ windowMs, max })` returns a middleware that counts requests per IP in a `Map` and blocks the extra ones with 429.
2. **Filters and paging** (`GET /users`): `?city=` filters without caring about upper or lower case, `?page=` and `?limit=` slice the result, and the answer includes `total` and `totalPages`.
3. **`router.param("id", loadUser)`**: finds the user once for every `/:id` route and puts it on `req.user`, or answers 404 (`{"error":"User 9 not found"}`).

## 🧠 What I learned

- A function that returns a middleware is how packages let you pass options, and the `Map` stays private inside it
- Query values are strings too, so `Number(req.query.page) || 1` gives a safe default
- `router.param` removes the same "find or 404" block from every handler
- The counts live in memory, so they reset when the server restarts and are not shared between servers

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 7 Day 1 - Routes, Controllers and Middleware - Exercises XP Ninja
