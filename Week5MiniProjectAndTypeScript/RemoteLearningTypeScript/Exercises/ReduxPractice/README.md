# 🧩 Redux practice with TypeScript

![Animated learning pulse](../../../../assets/readme/folder-pulse.svg)

Two small interfaces share a typed Redux Toolkit store, a router, and a test suite. The task list persists in the browser. The practice profile uses an in-memory account and simulated requests.

| Project | Try it | What to check |
| --- | --- | --- |
| [Gold · Todo list](ExercisesXPGold/) | `/#/gold` | Create a dated task, reload, filter overdue tasks, then complete it. |
| [Ninja · Practice profile](ExercisesXPNinja/) | `/#/ninja/login` | Sign in with the fictional account documented in the project, edit the profile, then sign out. |

From this directory, install the locked dependencies and start the development server.

```bash
npm ci
npm run dev
```

The development server listens on port 5404. Run `npm test` for the DOM, route and storage checks. Run `npm run build` for strict TypeScript checking and the production bundle.
