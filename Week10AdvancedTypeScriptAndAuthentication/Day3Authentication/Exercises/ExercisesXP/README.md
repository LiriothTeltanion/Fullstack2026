# 🥉 Exercises XP - Persistent JWT Authentication

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xp-cac365f6ad.svg" width="100%" alt="Progress card for Exercises XP">

</div>

An Express API with validated registration, bcrypt passwords, local email confirmation, short-lived access JWTs, rotating refresh JWTs and persistent session revocation.

## ▶️ How to run

Use Node.js 24 or newer. From this folder:

```bash
cp .env.example .env
npm install
npm test
npm run dev
```

Set `JWT_SECRET` in the local `.env` to a random value of at least 32 characters. A suitable value can be generated locally with `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`. Keep that value in the local configuration. An optional independent `JWT_REFRESH_SECRET` can be supplied. Otherwise the server derives a separate purpose-specific refresh key from the master key.

The API listens on `http://127.0.0.1:5000`. `PORT` changes it. `AUTH_DB_FILE` selects a SQLite file, with `data/auth.sqlite` as the default. The database schema is created automatically. Users, email confirmation and session revocation survive a restart.

## Registration and local email confirmation

Register with a username of 3–32 letters, digits, dots, underscores or hyphens, a valid email, and a password of at least eight characters and at most 72 UTF-8 bytes. Usernames and emails are normalized for duplicate checks.

For local practice, use a synthetic address such as `writer@example.com`. Registration returns a `developmentConfirmation.token`. Send it in a JSON body to `POST /api/auth/confirm-email`. The token expires after 24 hours, is stored only as a SHA-256 digest, and can be used once. Login requires confirmation.

This local workflow sends no email. Production registration requires an email delivery transport, which remains an integration task. With `NODE_ENV=production`, the local token response is disabled and registration reports that missing transport. Existing confirmed accounts can still authenticate.

## Endpoints

| Method | Endpoint | Behavior |
|---|---|---|
| POST | `/api/auth/register` | Validate, hash, persist and return local confirmation data |
| POST | `/api/auth/confirm-email` | Confirm an unexpired token once |
| POST | `/api/auth/login` | Set access and refresh cookies and return the access token |
| POST | `/api/auth/refresh` | Rotate the refresh token and issue a new access token |
| POST | `/api/auth/logout` | Revoke the session family and clear both cookies |
| GET | `/api/auth/me` or `/api/auth/profile` | Return the authenticated user's public profile |
| GET | `/api/users` | Preserve the protected user-list exercise |
| GET | `/api/health` | Check API availability |

[requests.http](requests.http) contains the complete local sequence.

## Token lifecycle

The access cookie keeps the existing name `token` and defaults to 15 minutes. A separate `refresh_token` cookie defaults to a seven-day session lifetime and is scoped to `/api/auth`. Both are HTTP-only and SameSite Strict. Production enables Secure cookies and requires HTTPS.

Access JWTs can also be supplied as `Authorization: Bearer ...`. Explicit bearer credentials take priority over the access cookie. JWT verification pins the algorithm, issuer, audience and token purpose. A refresh JWT cannot authenticate a protected access route.

Each refresh atomically replaces the previous refresh identifier in SQLite. Reusing an earlier token revokes its entire session family, including access JWTs already issued to that family. Clients should serialize refresh requests. Logout revokes server-side state, so clearing cookies is accompanied by durable invalidation.

`ACCESS_TOKEN_SECONDS` and `REFRESH_TOKEN_SECONDS` configure the lifetimes. The refresh lifetime must be longer. Its seven-day default is an absolute family lifetime.

## Limits and checks

Registration, confirmation and login each have independent limits of ten requests per 15 minutes. Refresh allows 30. A broader API limit allows 100. Cross-origin mutation requests are rejected.

Seven HTTP integration tests use synthetic accounts, isolated temporary databases and locally generated signing values. They check validation, confirmation expiry and single use, bcrypt storage, cookie properties, protected profiles, access expiry, refresh rotation/replay, concurrent refresh behavior, logout, restart persistence, rate limits and the production confirmation boundary.

Created and verified 2026-11-25, Asia/Jerusalem.

[JWT library documentation](https://github.com/auth0/node-jsonwebtoken) · [Refresh rotation reference](https://auth0.com/docs/secure/tokens/refresh-tokens/refresh-token-rotation)

## 🧠 What I learned

- bcrypt stores the salt inside the hash, so `bcrypt.compare` needs only the password and the saved hash
- Giving the same 401 for "unknown user" and "wrong password" keeps the API from revealing which usernames exist
- An httpOnly cookie can't be read by JavaScript in the page, which protects the token if a script ever gets injected
- `toPublic(user)` is the only way users leave the model, so the hash can't slip into a response by accident
- `router.use(verifyToken)` at the top of a router protects every route in it with one line
- `express-rate-limit` allows each IP 100 requests per 15 minutes, and register and login get a stricter 10, which slows down password guessing

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Week 10 Day 3 - Authentication - Exercises XP
