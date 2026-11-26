# NoteSaver production regression tests

Install the app and build it with `npm ci && npm run build` in the exercise folder.
Install test dependencies with `npm ci --prefix tests`. In this folder, run
`npx playwright install chromium` once and then `npm test`. The app-level `npm test`
delegates to this same suite. Both dependency trees have their own lockfile.

The seven default tests use Playwright and an actual production build served on
`127.0.0.1` with an automatically selected free port. A small fixture is built into
the ignored `tests/dist` directory using the app's existing Vite/React setup and
the real `useLocalStorage` module. Browser contexts are isolated per test. Network
requests outside the owned loopback origin are blocked and counted as failures.
Quota/security simulations affect only the synthetic `gold-note` storage key.

Coverage includes real writes/reloads, write denial and recovery, the last good
saved value, initially blocked storage, six corrupt/wrong-type values, narrow
layouts, the cart and previous-value entry points, generic JSON and functional
setters. The failure message must remain a polite status and must never claim
that an unsuccessful write was saved. The default suite needs no external service
or credentials.

Optional environment variables:

- `PW_CHANNEL=msedge` selects an already installed Edge instead of Chromium.
- `NOTE_QA_OUTPUT` writes a JSON result ledger and screenshots to an explicitly
  chosen private directory. Screenshot output does not alter which layouts are tested.
- `NOTE_BASELINE_DIST` adds an eighth diagnostic against an independently built
  original app. Build that original with `--base=/baseline/`; the diagnostic
  deliberately confirms its false-save feedback and null-value crash. No original
  source or baseline artifact is bundled with this exercise.
