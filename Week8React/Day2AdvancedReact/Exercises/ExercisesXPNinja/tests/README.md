# Fetch state browser regression tests

These tests use original synthetic tasks, users and posts. API requests are intercepted before contact; no external data, credentials or production writes are used. They serve the actual production build on a loopback HTTP server and close the browser/server afterward.

From the exercise folder:

```sh
npm install
npm run build
cd tests
npm ci
npm test
```

Windows uses the installed Microsoft Edge by default. Elsewhere, run `npx playwright install chromium` once before testing. `PW_CHANNEL=chrome` or `PW_CHANNEL=msedge` selects an installed browser where supported.

Coverage: loading, task navigation boundaries, late-response isolation, removal of stale success after an HTTP error, recovery on a new URL, unchanged sibling state, case-insensitive user filtering without another request, all 20 five-post pages, first/last controls, user HTTP failure, post network failure and reload recovery. A 390px check covers horizontal overflow. Screenshots and JSON results go to ignored `test-results/`.

If the failed-task regression is run on the previous hook, it fails because task3 remains visible after task4 returns503. The fixed hook clears data when a request begins.
