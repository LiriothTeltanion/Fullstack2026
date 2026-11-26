# 🎮 Mini Project - Users and Posts

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/users-and-posts-ebd02a6d9b.svg" width="100%" alt="Progress card for Users and Posts">

</div>

A two-page React Router app on top of JSONPlaceholder: the home page lists the users as cards, and clicking one opens `/users/:userId` with that person's details and posts.

## ▶️ How to run

```bash
npm install
npm run dev
```

Vite prints a local address (usually `http://localhost:5173`); I open it in the browser.

## 🎯 The challenge

The following table describes the retained earlier hook examples. See **Current class lifecycle route** below for the active application.

| File         | What it does                                                                                                    |
| ------------ | --------------------------------------------------------------------------------------------------------------- |
| `src/api.js` | `getUsers`, `getUser(id)` and `getPostsByUser(id)` share one `getJson` helper that throws on a bad status       |
| `UserList`   | Loads the users in `useEffect` and shows loading, error or a grid of linked cards                               |
| `UserPosts`  | Reads `userId` with `useParams`, loads the user and the posts together with `Promise.all`, and lists every post |
| `App`        | Routes `/`, `/users/:userId` and a `*` "Page not found." fallback                                               |

## 🧠 What I learned

- `useParams` turns part of the URL into a variable my component can use
- `Promise.all` starts both requests at the same time instead of one after the other
- Keeping the fetch calls in `api.js` made the components shorter and the URLs easy to change
- Adding `userId` to the dependency array reloads the page data when I go to another user

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 8 Day 2 - Advanced React - Mini Project

## Current class lifecycle route

The active routes now mount `UsersList` and `PostList` class components. Both fetch in `componentDidMount`; `PostList` reloads when its `userId` prop changes in `componentDidUpdate`. A small `useParams` route adapter passes the identifier into the class. `componentWillUnmount` aborts pending work, and a request version prevents an older route from replacing newer data.

The existing `/`, `/users/:userId` and unknown-route fallback remain. Loading, empty, failure and success are distinct states. Failed requests have retry buttons, and the All users link remains available while loading or after an error. The earlier `UserList.jsx` and `UserPosts.jsx` hook examples are preserved unchanged as reference files; the earlier table and reflections describe those retained examples rather than the current active route.

Use Node 22.13+ on the 22.x line, or Node 24+, then `npm ci`, `npm test` and `npm run build`. Normal use reads JSONPlaceholder's public sample API; it does not create records. The automated API tests use synthetic fetch fixtures without network access. Private browser checks mount the production app with intercepted fixtures to verify class lifecycles, navigation, loading/empty/error/retry paths, keyboard use and mobile widths.

The toolchain uses Vite 7.3.8 and the compatible React plugin, with React 18 retained and React Router 7.18.7. Class components remain supported; see the [React lifecycle reference](https://react.dev/reference/react/Component) and [React Router compatibility package](https://api.reactrouter.com/v7/modules/react-router-dom.html). The router moved from 6.x to 7.18.7 because the current 6.x line still reports two moderate advisories. The existing declarative routes and React 18 are retained; production navigation is checked with fixtures.

Built with AI-assisted tooling; functionality is tested separately from learner review.
