# 🥉 Exercises XP

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xp-cac365f6ad.svg" width="100%" alt="Progress card for Exercises XP">

</div>

An Express API with real login. Passwords are hashed with bcrypt, a successful login gets a JSON Web Token in an httpOnly cookie, and a middleware protects the routes that need a logged-in user.

## ▶️ How to run

```bash
cp .env.example .env   # then put a long random value in JWT_SECRET
npm install
npm run dev
```

Try the requests in `requests.http`, or with curl:

```bash
curl -X POST localhost:5000/api/auth/register -H "Content-Type: application/json" \
  -d '{"username":"kevin","email":"kevin@example.com","password":"superSecret1"}'
curl -c cookies.txt -X POST localhost:5000/api/auth/login -H "Content-Type: application/json" \
  -d '{"username":"kevin","password":"superSecret1"}'
curl -b cookies.txt localhost:5000/api/auth/me
```

What I got when I ran those steps (plus two error cases):

```
POST /api/auth/register  → 201 {"message":"User created","user":{"id":1,"username":"kevin",...}}
POST /api/auth/register  → 409 {"error":"That username or email is already taken"}
POST /api/auth/login (bad password) → 401 {"error":"Wrong username or password"}
POST /api/auth/login     → 200, Set-Cookie: token=...; HttpOnly; SameSite=Strict
GET  /api/auth/me        → 200 {"user":{"id":1,"username":"kevin","email":"kevin@example.com",...}}
POST /api/auth/logout, then GET /api/users → 401 {"error":"Please log in first"}
```

## 🎯 The challenge

| Endpoint | What it does |
|---|---|
| `POST /api/auth/register` | Checks the fields, refuses duplicates (409), hashes the password with `bcrypt.hash` (10 rounds) |
| `POST /api/auth/login` | Compares with `bcrypt.compare`, signs a 15-minute JWT, sets it as an httpOnly cookie and also returns it |
| `POST /api/auth/logout` | Clears the cookie |
| `GET /api/auth/me` | Protected: the logged-in user's public data |
| `GET /api/users` | Protected: every user, without password hashes |

`middleware/verifyToken.js` reads the token from the cookie or from `Authorization: Bearer …`, verifies it and sets `req.user`. Users are stored in memory, so they reset when the server restarts.

## 🧠 What I learned

- bcrypt stores the salt inside the hash, so `bcrypt.compare` needs only the password and the saved hash
- Giving the same 401 for "unknown user" and "wrong password" keeps the API from revealing which usernames exist
- An httpOnly cookie can't be read by JavaScript in the page, which protects the token if a script ever gets injected
- `toPublic(user)` is the only way users leave the model, so the hash can't slip into a response by accident
- `router.use(verifyToken)` at the top of a router protects every route in it with one line
- `express-rate-limit` allows each IP 100 requests per 15 minutes, and register and login get a stricter 10, which slows down password guessing

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 10 Day 3 - Authentication - Exercises XP
