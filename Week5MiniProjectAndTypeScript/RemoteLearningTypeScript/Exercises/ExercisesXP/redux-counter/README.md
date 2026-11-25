# Typed Redux Counter

A React + TypeScript counter for chapter #4303. Redux Toolkit owns `{ counter: { value: 0 } }`; the two buttons dispatch `increment` and `decrement`. Negative values are part of the exercise.

## Run locally

Use Node 22.13+ or a supported newer version and npm. From this folder:

```bash
npm ci
npm start
```

Vite prints a loopback URL, normally `http://127.0.0.1:5173/`. Choose another port with `npm start -- --port 5402`.

```bash
npm run typecheck
npm test
npm run build
npm run preview -- --port 5402
```

`npm test` runs Vitest once. The production build goes into `dist/`; the preview command serves that build locally.

## Assignment structure

| File                       | Responsibility                                                                 |
| -------------------------- | ------------------------------------------------------------------------------ |
| `src/counterSlice.ts`      | Typed initial value zero and increment/decrement reducers                      |
| `src/store.ts`             | `configureStore`, `RootState`, `AppDispatch`, and an independent-store factory |
| `src/index.tsx`            | React root wrapped in React Redux `Provider`                                   |
| `src/Counter.tsx`          | `useSelector`, `useDispatch`, live count and Increment/Decrement buttons       |
| `src/App.test.tsx`         | Real component and Provider: 0 → 1 → 0 → -1                                    |
| `src/counterSlice.test.ts` | Initial state, immutable updates, typed store sequence and independent stores  |

Reloading creates a new store at zero. No persistence or network service is required. The count is announced through a polite live region, with keyboard-operable controls and visible focus.

## CRA origin and modern execution

The application was first created and successfully checked with `create-react-app@5.1.0 --template typescript`, completing the chapter's requested scaffold step. [React has deprecated Create React App](https://react.dev/blog/2025/02/14/sunsetting-create-react-app). The execution toolchain was then migrated to Vite 8 and Vitest 5, preserving the Counter, App, slice, store, Provider, runtime package versions and their behavior. TypeScript 7 supplies strict semantic checking.

This is the explicit difference from the chapter's legacy run setup: Vite supplies the development server and production build; Vitest supplies the test runner. The counter still uses the chapter's React Redux APIs and named files. The solution is self-contained: related counters elsewhere in the repository are references rather than cross-project imports. The nine original TypeScript console practices remain unchanged in the parent folder.

`src/vite-env.d.ts` provides Vite's client types. Root `index.html` is the browser entry. Unused template icons remain under public assets; the original scaffold and first verified CRA variant are retained privately.

## Verification · 2026-11-25

TypeScript semantic checking, three reducer/store/UI tests in two suites, and the production build passed locally. Browser smoke checks cover the same 0 → 1 → 0 → -1 sequence on desktop and a narrow mobile viewport. Re-run the commands above to check your local installation.

Both `npm audit` and `npm audit --omit=dev` are checked for this application independently of the repository root. Security advisories can change after the lockfile is generated; rerun these commands for current results.

Built with AI-assisted tooling; I reviewed, tested and can explain every change.
