# 🔑 Daily Challenge - Login and Register

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

A React Router client and an Express API for the Week 14 login/register exercise. Registration accepts name, email and password and opens the dashboard. Sign-in accepts email and password, opens the same dashboard on success and shows `not registered` on failure. Duplicate registration shows `already registered` in the form.

## ▶️ How to run

Use Node 22.13+ or a supported newer version. Install each side once:

```bash
cd server
npm install
cd ../client
npm install
```

### PostgreSQL environment

Create a dedicated empty PostgreSQL database named `s14_login_register`. From `server/`, copy `.env.example` to `.env`, set the connection values, then run:

```bash
npm run db:init
npm start
```

The API listens on port 3014. In a second terminal, from `client/`:

```bash
npm run dev
```

Open the address printed by Vite. The dev proxy forwards `/api` to port 3014. For one-origin serving, run `npm run build` in `client/` before starting the server and open `http://localhost:3014/`. The server serves the built client and its `/signin`, `/register` and `/dashboard` routes.

### Isolated development fixture

`npm run dev:fixture` from `server/` starts a temporary in-memory PostgreSQL WASM instance through the PostgreSQL wire protocol and runs the same Knex model and Express API. Its accounts reset when it stops. The normal `npm start` command uses the configured PostgreSQL database.

## Data and API

| Table   | Fields                                                   |
| ------- | -------------------------------------------------------- |
| `users` | `id`, `name`, unique `email`, `joined` date              |
| `login` | `id`, bcrypt `hash`, unique `email` referencing the user |

The two inserts run in one transaction. A failure in the hash insert rolls back the user insert. Emails are trimmed and normalized to lowercase before storage. Passwords are validated against bcrypt's 72-byte limit and only their hash is stored. Responses select the public profile fields, and PostgreSQL casts the joined date to text to keep its calendar date stable across host timezones.

| Endpoint             | Input and result                                                                 |
| -------------------- | -------------------------------------------------------------------------------- |
| `GET /api/health`    | Process status                                                                   |
| `POST /api/register` | `{ name, email, password }`; 201 with the profile or 409 for an existing account |
| `POST /api/signin`   | `{ email, password }`; profile or `not registered`                               |

The same REST routes are mounted at `/health`, `/register` and `/signin` for direct exercise calls. The browser uses `/api`. The dashboard keeps the returned profile in React state. Reloading opens the sign-in route.

This course demonstration verifies credentials and displays the resulting profile. It does not issue a persistent session or protect additional server resources. A deployed account system would need a server-managed session and authorization before adding protected data.

## Verification · 2026-11-25

Run `npm test` in `server/` for the PostgreSQL-protocol integration test. It verifies schema, validation, bcrypt, duplicate accounts, login, rollback, concurrent requests and storage failures using a fresh disposable database. Run `npm test` in `client/` for the DOM-level routing/form test, and `npm run build` for the production bundle.

This project reuses the transaction and public-field patterns from Week 7's RegistrationAndLogin with the Week 14 `users`/`login` schema. Its imports and dependencies are contained inside this folder.

Built with AI-assisted tooling; I reviewed, tested and can explain every change.
