# 🥉 Exercises XP

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xp-7d98bc44b9.svg" width="100%" alt="Progress card for Exercises XP">

</div>

My first React components written in TypeScript. Each exercise types one thing: props, state, an object prop, a list and form events.

## ▶️ How to run

```bash
npm install
npm run dev
```

`npm run typecheck` runs `tsc` on the whole `src` folder without building.

## 🎯 The challenge

1. **Greeting.** `GreetingProps` has required `name` and `messageCount` props and an optional `age`. It displays the unread-message count and only shows age when supplied.
2. **Counter.** `useState<number>(start)` with a `start` prop that defaults to 0. A typed `none | increment | decrement` state records the last action and announces it in a status region.
3. **UserCard.** Optional name, age and role props default to Anonymous, 0 and Member. An omitted age displays Age not provided. The earlier User object and highlight props remain supported.
4. **UserList.** useEffect fetches https://jsonplaceholder.typicode.com/users, with typed state, loading, HTTP/shape errors and cleanup cancellation. Local signup examples remain visible separately.
5. **SignupForm.** `ChangeEvent<HTMLInputElement>`, `ChangeEvent<HTMLSelectElement>` and `FormEvent<HTMLFormElement>`, and an `onAdd` prop typed as `(user: Omit<User, "id">) => void`.

## Verification

Run `npm test` for the actual application entry rendered in a local DOM: greeting counts, preserved optional age, the initial counter value, increment/decrement and last-action updates, optional UserCard defaults and the existing user list with a synthetic fetch response. No external API is contacted by the test. `npm run typecheck` checks strict prop/state types; `npm run build` also builds the production bundle.

## 🧠 What I learned

- Typing props with an `interface` made the editor list every prop and flag a missing `name` before I ran anything
- `Omit<User, "id">` describes "a user before it has an id" without writing a second interface
- `User["role"]` reuses the union `"student" | "mentor"` for the select's state
- Event types like `FormEvent<HTMLFormElement>` are only needed when the handler is defined outside the JSX; inline handlers get them inferred

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 10 Day 1 - Using TypeScript with React - Exercises XP
