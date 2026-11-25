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
