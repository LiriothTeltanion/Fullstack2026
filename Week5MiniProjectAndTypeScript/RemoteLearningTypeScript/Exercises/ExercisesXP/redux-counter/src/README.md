# Counter source

`counterSlice.ts` owns typed state, `store.ts` assembles the Redux store, and `Counter.tsx` reads and dispatches through React Redux. `index.tsx` provides that store to App. The adjacent tests exercise the reducer, real store and rendered UI.
