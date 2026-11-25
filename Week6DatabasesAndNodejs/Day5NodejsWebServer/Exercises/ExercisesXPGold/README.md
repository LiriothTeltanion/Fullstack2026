# 🥇 Exercises XP Gold

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xp-gold-b71bef363f.svg" width="100%" alt="Progress card for Exercises XP Gold">

</div>

One server, [server.js](server.js), that reads query strings, parses POST bodies and runs a small todo API in memory. The body parsing lives in [httpHelpers.js](httpHelpers.js).

## ▶️ How to run

```bash
node server.js
```

It listens on `http://localhost:3010`, and `PORT=4000 node server.js` picks another port. Calls I made with `curl`:

```
GET    /greet?name=Kevin&lang=es  -> 200 {"message":"Hola, Kevin"}
GET    /greet?lang=fr             -> 400 {"error":"lang must be one of en, es, he"}
POST   /echo  {"song":"Dream House","year":2013}
                                  -> 200 {"received":{"song":"Dream House","year":2013},"keys":2}
POST   /echo  {oops               -> 400 {"error":"Body is not valid JSON"}
POST   /todos {"title":"Build the emoji game"}
                                  -> 201 {"id":2,"title":"Build the emoji game","done":false}
PATCH  /todos/2                   -> 200 {"id":2,"title":"Build the emoji game","done":true}
DELETE /todos/1                   -> 204
GET    /todos/9                   -> 404 {"error":"No todo 9"}
```

## 🎯 The challenge

| Route | What it does |
|---|---|
| `GET /greet` | Reads `name` and `lang` with `url.searchParams`; greets in English, Spanish or Hebrew |
| `POST /echo` | Sends the JSON body back with the number of keys |
| `GET /todos`, `GET /todos/:id` | All todos, or one by id |
| `POST /todos` | Adds a todo; an empty or missing `title` is a 400 |
| `PATCH /todos/:id` | Flips `done` |
| `DELETE /todos/:id` | Removes it and answers 204 with no body |

`readJsonBody()` collects the chunks of the request, refuses bodies over 10 000 characters and rejects with a `status` that the server turns into the response code.

## 🧠 What I learned

- A request body arrives in pieces, so reading it means listening for `data` and `end`
- `new URL(req.url, base)` splits the path from the query string for me
- Splitting the path into `["todos", "2"]` was enough for simple `:id` routes without a framework
- One `.catch()` around `handle()` turns every thrown error into a JSON answer

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 6 Day 5 - Node.js Web Server - Exercises XP Gold
