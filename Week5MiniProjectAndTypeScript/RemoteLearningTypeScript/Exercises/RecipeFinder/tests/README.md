# Recipe Finder tests

Run `npm test` from the [exercise folder](../README.md).

- [`App.test.tsx`](App.test.tsx): user interactions through the real React tree and Redux store in jsdom, with controlled fetch responses.
- [`catalog.test.ts`](catalog.test.ts): the shipped JSON, validation failures and ingredient matching semantics.
- [`setup.ts`](setup.ts): clean up each rendered tree between tests.
