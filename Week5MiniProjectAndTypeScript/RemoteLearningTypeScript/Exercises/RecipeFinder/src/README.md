# Recipe Finder source

The React interface, typed Redux store, slice and local catalog boundary.

- [`App.tsx`](App.tsx): search, list, selected detail and loading/error/empty states.
- [`catalog.ts`](catalog.ts): JSON validation and ingredient matching.
- [`recipesSlice.ts`](recipesSlice.ts): async loading, actions and memoized selectors.
- [`store.ts`](store.ts) and [`hooks.ts`](hooks.ts): store factory and typed hooks.
- [`types.ts`](types.ts): recipe and ingredient contracts.
- [`main.tsx`](main.tsx): React entry point and Redux provider.
- [`index.css`](index.css): responsive styles and reduced motion.

See the [exercise README](../README.md) for commands and behavior.
