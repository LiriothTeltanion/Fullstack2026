# 💪 Daily Challenge - Generic Data

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/generic-data-650cfbb801.svg" width="100%" alt="Progress card for Generic Data">

</div>

A generic data component. `DataFetcher<T>` loads JSON from a URL, shows loading and error messages, and hands the typed data to a `render` function. The same component shows users, posts and todos from JSONPlaceholder.

## ▶️ How to run

```bash
npm install
npm run dev
```

Needs internet access for `jsonplaceholder.typicode.com`.

## 🎯 The challenge

| Piece | What it does |
|---|---|
| `DataState<T>` | Union of `loading`, `error` (with `message`) and `success` (with `data: T`) |
| `useData<T>(url)` | Fetches with an `AbortController`, checks `response.ok`, and returns `{ state, reload }` |
| `DataFetcher<T>` | Title, Reload button, loading and error text, and `render(state.data)` on success |
| `App` | Three tabs that use `DataFetcher<User[]>`, `DataFetcher<Post[]>` and `DataFetcher<Todo[]>` |

## 🧠 What I learned

- With the `DataState<T>` union, `state.data` only exists after checking `status === "success"`, so I can't render data that isn't there
- Writing `<DataFetcher<Post[]> ...>` in JSX sets `T` explicitly when it can't be inferred from the props
- The abort in the effect cleanup stops a slow answer for the old tab from replacing the new one
- `reload` only bumps a counter that is in the effect's dependency list, which is enough to run the fetch again
- `response.json()` is untyped, so the `as Promise<T>` cast is a promise I make, not something TypeScript checks

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 10 Day 2 - Mini-project - Daily Challenge
