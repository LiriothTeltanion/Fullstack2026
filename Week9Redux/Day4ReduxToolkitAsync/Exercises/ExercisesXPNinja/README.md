# 🥷 Exercises XP Ninja

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xp-ninja-6b71930383.svg" width="100%" alt="Progress card for Exercises XP Ninja">

</div>

The same kind of data loading as the XP, but with RTK Query instead of hand-written thunks. One `createApi` file describes the endpoints, and the generated hooks do the fetching, caching and loading flags.

## ▶️ How to run

```bash
npm install
npm run dev
```

Needs internet access for `jsonplaceholder.typicode.com`.

## 🎯 The challenge

1. **API slice.** `todosApi` uses `fetchBaseQuery` with the JSONPlaceholder base URL and one query, `getTodos`.
2. **Store setup.** The API reducer is added under `todosApi.reducerPath` and its middleware with `concat`.
3. **Mutations.** `addTodo` (POST), `toggleTodo` (PATCH) and `deleteTodo` (DELETE).
4. **Optimistic updates.** Each mutation changes the cached list right away with `updateQueryData` inside `onQueryStarted`, and calls `patch.undo()` if the request fails.
5. **Hooks in the component.** `useGetTodosQuery` gives `isLoading`, `isError`, `isFetching` and `refetch`, and every mutation hook returns a trigger function.

Note: JSONPlaceholder doesn't store writes, so pressing **Refetch** brings back the original eight todos.

## 🧠 What I learned

- RTK Query replaced my thunk, my slice and my `status` field with one endpoint definition and a hook
- `isLoading` is only true for the first load, while `isFetching` is also true on every refetch
- `updateQueryData` edits the cached data with Immer, the same way a slice reducer does
- Using `Date.now()` as the id of a new todo avoids the duplicate `id: 201` the fake API returns for every POST

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 9 Day 4 - Redux Toolkit and Async Logic - Exercises XP Ninja
