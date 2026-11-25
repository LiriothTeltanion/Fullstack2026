# 🖥️ Server - Collaborative Storytelling App

<div align="center">

<img src="../../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../../assets/readme/progress/collaborative-storytelling-app-9853b7f4f0.svg" width="100%" alt="Progress card for Collaborative Storytelling App">

</div>

The Express back end for Collaborative Storytelling App.

## Contents

- [db/schema.sql](db/schema.sql) creates PostgreSQL tables; npm run db:setup applies them.
- [models/refreshModel.js](models/refreshModel.js) persists and atomically rotates refresh sessions.
- [routes/contributorRoutes.js](routes/contributorRoutes.js) exposes contributor invite/list/removal routes.

- [`controllers/`](controllers/)
- [`middleware/`](middleware/)
- [`models/`](models/)
- [`routes/`](routes/)
- [`.env.example`](.env.example)
- [`app.js`](app.js)
- [`package.json`](package.json)
- [`server.js`](server.js)
- [`settings.js`](settings.js)

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 10 Day 4 - TypeScript and Authentication Project - Mini Project

## Run and deploy

See the [exercise deployment guide](../README.md#hosted-demo-and-reproducible-deployment) for exact repository roots, environment names and same-origin proxy rules. Use `npm ci --omit=dev` and `npm start` for the hosted service; never run schema setup with the runtime credential. `GET /api/health` returns 503 when PostgreSQL is unavailable.

Run `npm ci && npm test` for isolated session persistence tests. The production session store is [sessionStore.js](sessionStore.js); setup-only DDL is in [db/init.js](db/init.js). The runtime queries qualify their schema explicitly for transaction-pooler compatibility.

## Story comments API

Authenticated readers use `GET /api/stories/:id/comments` to receive
`{ comments: StoryComment[] }` in chronological order. The matching `POST` accepts
`{ body: string }` and returns `201 { comment: StoryComment }`. Comment identity
contains `id`, `storyId`, public `author` (`id` and `username`), `body` and an ISO
`createdAt` timestamp. The author is taken from the authenticated session/token,
not from submitted JSON metadata.

Text is trimmed at its outer edges and must contain 1–2000 Unicode characters.
Blank/non-string/overlong input returns 400 before any write; missing stories
return 404. Any authenticated user can read the current story list, so those
readers may comment without gaining story-edit or contributor-management rights.
Comments are persisted in PostgreSQL and cascade when their story is deleted.
Explicit memory mode follows the same contract for local demonstrations.

See [the schema](db/README.md) and [hosted migration order](db/migrations/README.md).
Local coverage is in `tests/comments.memory.test.js` and
`tests/comments.postgres.test.js`; PostgreSQL tests use an isolated PGlite database
and loopback HTTP, without reading production credentials or reaching hosted data.
