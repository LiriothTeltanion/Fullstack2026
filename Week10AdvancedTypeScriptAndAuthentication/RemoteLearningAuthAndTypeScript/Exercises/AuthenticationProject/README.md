# 🧪 Remote Exercise - Authentication and TypeScript Project

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/authentication-project-40db85cf1f.svg" width="100%" alt="Progress card for Authentication and TypeScript Project">

</div>

Sign up, log in and edit a protected profile. The Express server hands out a JWT that the client sends in the `Authorization` header, and the React side keeps the session in a typed `AuthContext`.

## ▶️ How to run

From the `AuthenticationProject` folder, open **two terminals**. Keep the server running in the first:

```bash
cd server
cp .env.example .env   # set JWT_SECRET
npm install
npm run dev            # http://localhost:5000
```

In the second terminal, start again from `AuthenticationProject`:

```bash
cd client
npm install
npm run dev            # http://localhost:5173, /api goes to the server
```

## 🎯 The challenge

**Server** (`server/`)

| Endpoint                  | What it does                                                                     |
| ------------------------- | -------------------------------------------------------------------------------- |
| `POST /api/auth/register` | Name, email and an 8+ character password; bcrypt hash; answers `{ token, user }` |
| `POST /api/auth/login`    | Checks the password and answers `{ token, user }` (1 hour token)                 |
| `GET /api/profile`        | Protected by `authenticate`, which reads `Authorization: Bearer <token>`         |
| `PUT /api/profile`        | Updates `name` and `bio` (cut to 280 characters)                                 |

A quick run against the dev server:

```
POST /api/auth/register  (bad email)       → 400 Please enter a valid email
GET  /api/profile        (no header)       → 401 Missing token
GET  /api/profile        (Bearer <token>)  → 200 {"user":{"id":1,"name":"Kevin",...}}
GET  /api/profile        (made-up token)   → 401 Token expired or invalid
```

**Client** (`client/`, React + TypeScript)

| Piece                      | What it does                                                                                                |
| -------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `api.ts`                   | Generic `request<T>()` and an `ApiError` class that keeps the HTTP status                                   |
| `AuthContext`              | `user`, `token`, `loading`, `login`, `register`, `logout`; checks a saved token with `/api/profile` on load |
| `RequireAuth`              | Shows its children to a logged-in user, or the `fallback` (the login page)                                  |
| `AuthPage` / `ProfilePage` | One form that switches between log in and sign up, and the profile editor                                   |

The token is kept in `sessionStorage`, so it survives a refresh and is gone when the tab closes. A page script could still read it, which is the trade-off against the httpOnly cookie I used in the Day 4 project.

## Local data and profile behavior

Accounts and profiles live only in the server process's memory. Restarting the server loses them; create an account again after a restart. Each process also has its own random JWT issuer, so a previous process's saved session is no longer accepted, even when `JWT_SECRET` stays the same. The client explains an unavailable saved session (401/404); a temporary connection failure keeps the saved session and offers **Retry session**.

Within one server process, user insertion synchronously enforces a unique trimmed, lowercase email; a duplicate registration returns 409 without replacing the account or consuming a user ID.

A supplied profile name must be nonblank text. An invalid name returns 400 without changing the bio. Bio-only updates and clearing the bio are supported. The editor preserves failed values, shows an associated name error, and displays normalized server values after a successful save. You can keep editing during a save. Save is disabled until the current request finishes, and duplicate submits are ignored. Newer field edits are preserved with a reminder that they are not saved yet; once Save is enabled again, press it again to save those edits. Responses from a session that has been logged out or replaced are ignored.

From `server`, run `npm test` for local account/profile and restart-lifetime regressions. From `client`, run `npm run typecheck` and `npm run build`.

## 🧠 What I learned

- Sending the token in a header means the client has to store it somewhere, and that choice decides how exposed it is
- `ApiError` with a `status` field let the context log out only on a real 401, not on a network hiccup
- Typing the context value as an interface made `useAuth()` give full autocomplete for `login`, `logout` and `user`
- `RequireAuth` keeps the "is anyone logged in?" check in one component instead of in every page
- `express-rate-limit` allows each IP 100 requests per 15 minutes (10 for register and login), and the email pattern can't backtrack, so a long fake address can't freeze the server

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 10 Remote Learning - Authentication and TypeScript - Remote Exercise
