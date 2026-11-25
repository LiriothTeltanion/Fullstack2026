# Final Project Scope

My working plan for the final project. I fill in every `_…_` line before I write code, and I update it when the
plan changes. The stack is fixed by the course: PostgreSQL, Express, React and Node.js (PERN).

## 1. The idea in one sentence

_Who is it for, what problem does it solve, and how?_

> Example shape: "A web app that helps **[users]** to **[do something]** without **[current pain]**."

## 2. Users

| User | What they want to do | Why they come back |
|---|---|---|
| _Visitor (not logged in)_ | _…_ | _…_ |
| _Registered user_ | _…_ | _…_ |
| _Admin (only if needed)_ | _…_ | _…_ |

## 3. MVP: the features I must finish

The smallest version that is still useful. If time is short, I cut from section 4, never from here.

| # | Feature | Done when… |
|---|---|---|
| 1 | Sign up, log in and log out (JWT + bcrypt) | A new user can register, log in and see a private page |
| 2 | _Main resource: create and list_ | _…_ |
| 3 | _Main resource: edit and delete_ | _…_ |
| 4 | _Search or filter_ | _…_ |
| 5 | Deployed and reachable by a link | Anyone can open the live URL |

## 4. Nice to have (only after the MVP works)

- _…_
- _…_

## 5. Out of scope

Things I will not build in this project, so they do not eat my time:

- _…_
- _…_

## 6. User stories

Format: "As a _user_, I want to _action_ so that _reason_."

1. _As a visitor, I want to …_
2. _As a user, I want to …_
3. _…_

## 7. Data model

| Table | Columns (type) | Relations |
|---|---|---|
| `users` | `id` (serial PK), `email` (unique), `password_hash`, `created_at` | has many _items_ |
| _`items`_ | _`id`, `user_id` (FK → users.id), `title`, …_ | belongs to `users` |
| _…_ | _…_ | _…_ |

## 8. API endpoints

| Method | Route | Auth | What it does |
|---|---|---|---|
| POST | `/api/auth/register` | no | Create a user |
| POST | `/api/auth/login` | no | Return a token |
| GET | `/api/_items_` | yes | List the logged-in user's items |
| POST | `/api/_items_` | yes | Create an item |
| PUT | `/api/_items_/:id` | yes | Update one item |
| DELETE | `/api/_items_/:id` | yes | Delete one item |

## 9. Pages (React routes)

| Route | Page | Main components |
|---|---|---|
| `/` | Home | _…_ |
| `/login`, `/register` | Auth forms | `LoginForm`, `RegisterForm` |
| `/dashboard` | Private area | _…_ |
| _…_ | _…_ | _…_ |

Wireframes: _link or sketch photo here._

## 10. Tech choices

| Part | Choice | Why |
|---|---|---|
| Database | PostgreSQL | Used all course long |
| Back end | Node.js + Express | Routes, controllers, middleware |
| Query layer | _pg or Knex_ | _…_ |
| Front end | React + Vite | _…_ |
| State | _useState / Context / Redux Toolkit_ | _…_ |
| Styling | _plain CSS / Bootstrap_ | _…_ |
| Hosting | _…_ | _…_ |
| External API | _none, or which one and its key in `.env`_ | _…_ |

## 11. Timeline

| When | Goal | Check |
|---|---|---|
| Day 1 | This scope document finished | Every `_…_` filled in |
| Day 2 | Database tables and seed data | `SELECT` returns my rows |
| Day 3 | Auth routes working in Postman | Register, login and a protected route |
| Day 4 | Main resource CRUD in the API | All endpoints answer |
| Day 5 | React pages for auth and the list | Log in from the browser |
| Week 12 Day 1 | Edit, delete, search; deploy | Live link works |
| Week 12 Day 5 | Demo Day | 5-minute demo rehearsed |

## 12. Risks and how I handle them

| Risk | Plan B |
|---|---|
| The external API is down or limited | Save a sample JSON and use it as a fallback |
| Deployment takes longer than planned | Deploy a "hello world" version on day 2 |
| A feature takes too long | Move it to section 4 and keep the MVP |

## 13. Daily log

| Date | What I did | Next step |
|---|---|---|
| _DD-MM-YYYY_ | _…_ | _…_ |
