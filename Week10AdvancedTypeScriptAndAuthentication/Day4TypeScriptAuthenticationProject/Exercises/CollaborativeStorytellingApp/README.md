# 🎮 Mini Project - Collaborative Storytelling App

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/collaborative-storytelling-app-9853b7f4f0.svg" width="100%" alt="Progress card for Collaborative Storytelling App">

</div>

A collaborative story editor with a React TypeScript client, Redux Toolkit and an Express API backed by PostgreSQL. Authors invite collaborators to continue their stories. The author alone can delete the story or remove collaborators.

## ▶️ How to run

Create a new local PostgreSQL database named storytelling first.

    cd server
    cp .env.example .env
    # Set DATABASE_URL, JWT_SECRET and SESSION_SECRET in .env.
    npm install
    npm run db:setup
    npm run dev

In another terminal run the client.

    cd client
    npm install
    npm run dev

Vite serves the client and proxies /api to the backend on port 5000. To try collaboration, register two users in separate browsers or a private window.

PostgreSQL is the default. For a disposable local demo, explicitly select STORAGE_MODE=memory. That mode resets its tables when the process stops. API field names and numeric IDs remain compatible with the earlier in-memory version.

## 🎯 The challenge

| Endpoint                        | Access                                                               |
| ------------------------------- | -------------------------------------------------------------------- |
| POST /api/auth/register, /login | Returns a user and a short-lived access token                        |
| POST /api/auth/refresh          | Rotates the httpOnly refresh cookie and returns another access token |
| POST /api/auth/logout           | Revokes the current refresh session and clears cookies               |
| GET /api/auth/me                | Checks the access JWT                                                |
| GET /api/stories                | Any signed-in user                                                   |
| POST /api/stories               | The signed-in user becomes the author                                |
| PATCH /api/stories/:id          | Author and invited collaborators                                     |
| DELETE /api/stories/:id         | Author only                                                          |
| POST /api/contributors          | Author only, using story_id plus user_id or username                 |
| GET /api/contributors/:story_id | Lists contribution IDs, user IDs and usernames                       |
| DELETE /api/contributors/:id    | Author only                                                          |

The original POST /api/stories/:id/contributors endpoint remains available. Unknown users and duplicate invitations return errors.

## 🧩 How the parts fit

- [schema.sql](server/db/schema.sql) defines users, stories, contributor relationships and rotating refresh sessions. Queries use PostgreSQL parameters.
- [storyModel.js](server/models/storyModel.js) translates SQL names to the existing camelCase JSON contract.
- [refreshModel.js](server/models/refreshModel.js) consumes and replaces a refresh session in one transaction.
- [shared/types.ts](shared/types.ts) defines the public User and Story shapes used by the client and referenced by the server model.
- [store.ts](client/src/store.ts) configures Redux Toolkit. [storySlice.ts](client/src/storySlice.ts) owns the user, access token, stories, loading and error states.
- The access JWT lasts 15 minutes and stays only in Redux memory. The refresh JWT lasts 7 days and stays in an httpOnly cookie. Reloading renews the session, and one failed authorized request can be retried after refresh.
- Concurrent refresh attempts share a promise. Story request IDs prevent older responses from replacing newer state.
- CSRF tokens protect changing requests. The API client reacquires an invalidated CSRF token once. Rate limits remain active.

## Deployment setup

For separate frontend and backend hosts, forward the frontend's /api path to the HTTPS backend so the browser cookie and CSRF flow stays same-origin. Keep DATABASE_URL and signing secrets on the backend, initialize the schema and set NODE_ENV=production for secure cookies. Hosting and database accounts are configured separately.

## 🧠 What I learned

- The server enforces story permissions even when a caller bypasses the buttons.
- PostgreSQL foreign keys and a unique story/user pair keep contribution records consistent. Deleting a story cascades to its contributions.
- JSON contracts can remain stable while the storage implementation changes.
- Access and refresh tokens serve different lifetimes. Revoking a refresh session prevents that session from issuing more access tokens.
- Redux stores session and story data while form input stays inside its component.

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 10 Day 4 - TypeScript and Authentication Project - Mini Project

## Hosted demo and reproducible deployment

Live demo: [Collaborative Storytelling](https://fullstack2026-storytelling.vercel.app). The [API health endpoint](https://fullstack2026-storytelling-api.vercel.app/api/health) checks database connectivity. These Vercel deployments are a working demo; the course's separate Render Web Service and Static Site deployment remains pending verification. No Render URL is claimed here yet.

The repository-relative exercise root is:

```text
Week10AdvancedTypeScriptAndAuthentication/Day4TypeScriptAuthenticationProject/Exercises/CollaborativeStorytellingApp
```

| Service         | Root relative to the exercise | Install / build           | Start / publish                                 |
| --------------- | ----------------------------- | ------------------------- | ----------------------------------------------- |
| Express backend | `server`                      | `npm ci --omit=dev`       | `npm start` (`node server.js`), provider `PORT` |
| React frontend  | `client`                      | `npm ci && npm run build` | Static directory `dist`                         |

On Render, prefix each root above with the full exercise path. Enable access to files outside the frontend root because `client/src` imports `../shared/types.ts` relative to the client project. On Vercel this is `sourceFilesOutsideRootDirectory: true`. The frontend production build uses TypeScript followed by Vite.

The browser always calls relative `/api/*` URLs. Forward those paths to the backend **before** the SPA fallback, preserving the complete `/api` path and request cookies. For example, Render Static Site rules should list `/api/*` → `https://<this-app-backend>.onrender.com/api/*` as a rewrite, then `/*` → `/index.html` as a rewrite. Replace only the dedicated backend placeholder after verifying its URL. The checked-in [Vercel configuration](client/vercel.json) points to this app's verified Vercel backend. The frontend needs no database or signing secrets.

Backend environment names:

- `NODE_ENV=production`, `STORAGE_MODE=postgres`, `DATABASE_SCHEMA=storytelling`.
- `DATABASE_URL`: a dedicated restricted PostgreSQL login through the transaction pooler; never an administrative connection.
- `JWT_SECRET` and `SESSION_SECRET`: independent long random signing secrets kept in the hosting secret store.
- `DATABASE_SSL=true` and, when required by the provider certificate chain, `DATABASE_CA_CERT` containing the official CA PEM. Certificate verification stays enabled. `NODE_EXTRA_CA_CERTS` is also supported by Node itself; `PGSSLROOTCERT` is not read by this application.
- `TRUST_PROXY=1` only behind the provider's trusted HTTPS ingress; `PORT` comes from the host.

Initialize a fresh database with an owner connection using `npm run db:setup`; it creates tables inside the validated `DATABASE_SCHEMA` in one transaction. Then deploy with a separate runtime login. The hosted private schema uses RLS plus narrowly scoped grants: users are selectable/insertable, story and HTTP-session rows support their normal CRUD operations, contributor and refresh rows support select/insert/delete, and refresh IDs allow row locking for atomic rotation. Runtime roles cannot create schema objects, delete users, or provision credentials. Public database API roles have no access to this schema. API routes enforce author/collaborator permissions for each signed-in user.

HTTP/CSRF sessions persist in PostgreSQL across backend instances and restarts; refresh sessions also persist there. Cookies are HttpOnly, Secure in production, and SameSite=Strict, so same-origin forwarding is required. Expired HTTP sessions are rejected immediately. Automatic pruning timers are disabled for serverless compatibility; database-owner maintenance can periodically remove expired `http_sessions` rows. Request rate limits are per process, not a global distributed quota.

Both hosting demos and the dedicated database use verified free plans. Free quotas and provider suspension/cold starts still apply; this is a coursework demo, not an uptime guarantee. Never enable a paid upgrade to reproduce it without a separate spending decision.

## Verification

```sh
cd server
npm ci
npm test
npm audit
cd ../client
npm ci
npm run build
npm audit
```

The server tests exercise the real session-store SQL against disposable embedded PostgreSQL (PGlite), including database close/reopen persistence, expiry, touch, deletion and explicit pruning. They never use a configured `DATABASE_URL`. Separate deployment QA verified real TLS PostgreSQL connections and HTTPS registration/login, story creation, author/collaborator restrictions, refresh rotation/replay rejection, deletion and logout. This bounded QA does not establish availability or load capacity.

Built with AI-assisted tooling; I reviewed, tested and can explain every change.

## Comment lifecycle extension

This extension preserves the existing comment JSON and authenticated GET/POST routes.
It adds the following story-scoped operations:

| Operation | Route                                         | Permission                                 |
| --------- | --------------------------------------------- | ------------------------------------------ |
| Read      | `GET /api/stories/:id/comments`               | Signed-in readers                          |
| Create    | `POST /api/stories/:id/comments`              | Signed-in readers; identity comes from JWT |
| Edit      | `PATCH /api/stories/:id/comments/:commentId`  | Comment author only                        |
| Delete    | `DELETE /api/stories/:id/comments/:commentId` | Comment author or story author             |

Editing accepts `{ "body": "Updated text" }`. The normalized body must contain
1–2000 Unicode code points. IDs, authorship, story ownership and the original
creation timestamp cannot be changed through this operation. Collaborators may
continue the story but gain no permission to edit or moderate another person's
comment. The write repeats its ownership and story checks in SQL, independently
of the controller's authorization check. Missing or stale comments return 404;
known comments belonging to another person return 403. Deleting again returns
404 rather than pretending the comment still exists.

The reader offers edit/save/cancel and an explicit delete/keep confirmation.
Failed edits retain the draft; failed deletions retain the comment and confirmation.
Successful edits and cancellations restore focus, and successful deletion moves
focus to the new-comment field. Discussion state is scoped to both the story and
signed-in user. Responses from an unmounted discussion cannot populate another
story or account. Comments remain rendered as text, including punctuation and
multilingual content.

### Database rollout

Fresh local databases already have the required comment columns; no data rewrite
is needed. On an existing hosted database, the database owner must apply
[`story-comment-lifecycle-hosted.sql`](server/db/migrations/story-comment-lifecycle-hosted.sql)
**after** the existing comment migration to enable editing and deletion in the deployed API.
It is repeatable and grants only `UPDATE (body)` and `DELETE` on comments to the
two existing backend roles. It preserves RLS and the denial of direct browser-role
access. Application identity is enforced by authenticated API routes, not by an
individual browser database role. Runtime credentials must remain private.

This source change does not execute a hosted migration or deploy the extension.
The comments lifecycle, migration grants, role matrix, Unicode boundaries,
invalid updates, wrong-story IDs and stale writes are exercised by `cd server && npm test`
against both disposable in-memory storage and embedded PostgreSQL/PGlite.
PGlite coverage does not verify a native PostgreSQL TCP/TLS connection or production.
The client is checked with `cd client && npm run build`; route parsing tests run
with `node --test tests/routes.test.mjs` in the client directory.

This is a bounded comments lifecycle extension. Reactions, WebSockets,
version history and the remaining advanced chapter features are not implemented
by this change, and passing these tests does not certify an entire optional rubric.

### Deployment documentation correction — 2026-11-26

The earlier paragraph describing Render verification as pending is historical.
The dedicated Render frontend is [Collaborative Storytelling on Render](https://fullstack2026-storytelling.onrender.com)
and its backend health URL is [Render API health](https://lirioth-fullstack2026-storytelling-api.onrender.com/api/health).
The Vercel links above remain an alternative demo. All use the same relative `/api`
contract. These URLs identify the existing deployment; the new lifecycle extension
still requires publication, the owner-applied migration and deployment QA.
Auth state is now owned by `authSlice.ts`; `storySlice.ts` owns the story collection.

### Compatibility before hosted grants

`GET /api/stories/comment-capabilities` is an authenticated, non-cacheable
capability read. It checks the actual PostgreSQL connection role's `UPDATE(body)`
and `DELETE` privileges in one small query. No environment flag, cached deployment
state or secret is returned. Existing comment GET/POST response shapes are unchanged.
The reader makes one extra capability request per discussion load; if an older API
does not provide it, read/create continue and edit/delete controls stay hidden.
An authorized direct mutation returns a generic 503 when its capability is absent;
identity/ownership violations still return 401/403. A permission revocation racing
with a write is also converted to that generic response, without database details.

Consequently this compatible source may deploy before the hosted migration:
existing readers can still list/post comments. After the database owner grants the
permissions, reload the page to discover them; no new deployment or server restart
is required. Each mutation independently rechecks the effective role. The API role
still has to satisfy the existing RLS policy; the capability endpoint does not grant
anything or replace per-user authorization. The PGlite HTTP fixture tests the same
running server first with SELECT/INSERT only, then with added UPDATE(body)/DELETE.

## Story author controls for new comments

The story author can close or reopen **new** comments. Existing comments remain
visible, and their existing author-edit and author/story-author delete rules are
unchanged. Contributors and readers cannot change this setting. The reader keeps
a failed comment draft and disables posting while settings are unavailable.
A stale page receives 409 if another session closed the discussion; reopening
lets the reader retry the retained draft. Use **Refresh comment settings** to
check another session's change without reloading the page or discarding a draft.

Authenticated `GET /api/stories/:id/comment-settings` returns `supported`,
`commentsOpen` and the current user's `canChange`. Author-only `PATCH` accepts
`{ "commentsOpen": false }` or `true`; non-boolean values return 400. Original
comment payloads and GET/POST response shapes are preserved.

### Optional database rollout

The default local schema and an unchanged older database keep discussions open
and report `supported: false`. In-memory demo storage supports the setting for
the life of that process. The optional owner-reviewed migration
[`story-comment-settings-hosted.sql`](server/db/migrations/story-comment-settings-hosted.sql)
adds `stories.comments_open` with `DEFAULT TRUE`, without rewriting comments. It
grants only the new column's SELECT/UPDATE to the two existing backend roles.
Publish this compatible API to every writer of the same database before opting in.
Older API processes do not enforce the new setting or join its locking protocol.
The migration is not run by startup, setup or deployment. Review the schema name and existing
roles before opting in on a local database. No hosted migration was executed by
this change, and it does not resolve unrelated hosted lifecycle grants.

Capability checks use the effective connection role without caching. Without the
column, the old read/create contract continues. With the column but without its
SELECT permission, new-comment writes fail closed rather than assuming open.
Without UPDATE permission, readers can still post to an open discussion but no
settings control is offered. A previous API without the settings route retains
its original open behavior. Reload a discussion after an owner changes grants.

PostgreSQL posting and setting changes acquire the same transaction-scoped
advisory lock, keyed by the qualified stories table and story ID. If a post
commits first, that comment remains; if closing commits first, the post returns 409. These rules cover application writes using this model across processes.
Direct owner SQL outside this protocol is not an application operation. Existing
comment editing/deletion does not use the new-comments setting.

This bounded extension does not implement reactions, live collaboration or
version history, and it is not a claim of complete optional-chapter coverage.
