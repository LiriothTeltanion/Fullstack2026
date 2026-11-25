# 🥷 Remote TypeScript · Practice profile

![Folder animation](../../../../../assets/readme/folder-pulse.svg)

A simulated login/profile workflow using Redux Toolkit, typed hooks and private React routes. It shares the parent Vite setup with Gold.

## Run 🚀

```bash
npm --prefix .. ci
npm --prefix .. run dev
```

Open [Ninja login](http://127.0.0.1:5404/#/ninja/login). The direct [profile route](http://127.0.0.1:5404/#/ninja/profile) redirects to login when unauthenticated. [Gold tasks](http://127.0.0.1:5404/#/gold) remains independently usable.

Only use fictional details. Demo email: demo@example.test. Demo password: practice123. This published fixture credential has no account outside this app.

```bash
npm --prefix .. test
npm --prefix .. run build
```

## State and flow 🧠

- src/authSlice.ts stores user, isAuthenticated, request status and errors.
- login, logout and updateProfile are async thunks simulated with a 150 ms setTimeout.
- src/Login.tsx validates and clears the password before dispatch. The password is never a thunk argument, Redux field, localStorage entry or network payload.
- src/Profile.tsx updates a name, fictional .test email and short biography; failures leave the previous profile intact.
- src/PrivateRoute.tsx observes authentication and redirects with useEffect; login redirects authenticated users to their profile.
- Typed useAppDispatch/useAppSelector hooks are shared in ../app/hooks.ts.
- Auth lives only in memory: reload signs out. There is no backend, token or security boundary protecting real data.

The shared tests exercise direct private-route access, wrong password/account, successful login, rejected/accepted update, logout redirect and password/storage checks. Strict TypeScript runs during the build.

## Architecture links 🔗

[Shared store](../app/store.ts) · [Routes](../app/App.tsx) · [DOM tests](../tests/run-dom-tests.mjs) · [Gold README](../ExercisesXPGold/README.md)

The Vite/Redux structure follows the [official Redux quick start](https://redux.js.org/tutorials/quick-start). No deprecated Create React App dependency is used.

Built with AI-assisted tooling; I reviewed, tested and can explain every change.
