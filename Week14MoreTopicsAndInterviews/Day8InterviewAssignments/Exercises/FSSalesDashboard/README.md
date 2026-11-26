# 📊 FS Developer Exam - Sales Dashboard

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

Fieldwork is a local sales dashboard with account access, company CRUD, meeting CRUD and monthly statistics.

## ▶️ How to run

Use Node.js 24 or newer.

```bash
npm install
npm test
npm start
```

Open `http://127.0.0.1:3000`. Create a local practice account with a username of 3–32 letters, digits, underscores or hyphens and a password of 10–128 characters. Use synthetic company and meeting records while evaluating the exercise.

## Stage environment

`PORT` changes the loopback port. `SALES_DB` selects a SQLite file. The default is `data/sales.sqlite`. SQLite creates the schema automatically. Users, companies and meetings persist across restart. Sessions expire after eight hours and reset when the server restarts.

Passwords are salted and hashed with scrypt. The session cookie is HTTP-only and SameSite Strict. Each account's data is filtered by its owner ID. Cross-origin mutation requests are rejected. Production mode enables secure cookies and requires an HTTPS reverse proxy, outside the local exercise setup.

## Screens

- **My business** lists, adds, edits and deletes companies.
- **Meetings** records company, date, location and summary with edit/delete controls.
- **Meeting statistics** shows a selected month's meeting total, daily counts and percentages, using native meter bars.

Deleting a company also removes its meetings after explicit confirmation. Dates are validated as real calendar dates. Empty and error states are visible.

## API

`POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout` and `GET /api/auth/me` manage account access.

`GET/POST /api/companies`, `GET/PUT/DELETE /api/companies/:id`, `GET/POST /api/meetings` and `GET/PUT/DELETE /api/meetings/:id` manage records. A company with meetings requires `?confirm=yes` to delete both.

`GET /api/statistics?month=YYYY-MM` returns the monthly total and each day's count and percentage.

[Assignment source](https://github.com/devtlv/studentsGitHub/blob/master/JS/Week10-ProjectsWeek/FS%20Developer%20Exam.pdf) · [Node SQLite reference](https://nodejs.org/api/sqlite.html)

Created 2026-11-25, Asia/Jerusalem.

## Checking account isolation and persistence

Run `npm test` from this directory. The six integration tests start the real HTTP server with temporary SQLite storage. They cover account access, company and meeting changes, isolation between accounts, monthly statistics, rejection of invalid dates, cascade confirmation and persistence across a server restart.

For a browser check, create a practice company, add two meetings on different days in one month, then open **Meeting Statistics**. Each day should account for half of that month's meetings. Sign out and use a second practice account to check that its company and meeting lists start empty.
