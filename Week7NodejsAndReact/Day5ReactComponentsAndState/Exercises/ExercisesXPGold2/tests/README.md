# Browser checks

Run the app's `npm install --no-package-lock`, `npm test` and `npm run build` first. This directory has a
separate locked Playwright dependency so browser tooling does not change the app bundle.

```bash
npm ci --prefix tests
npx --prefix tests playwright install chromium
npm test --prefix tests
```

Run these commands from the exercise directory. The runner imports `playwright` normally
from this package, serves `../dist` on an automatically chosen loopback port, blocks
external requests, uses fresh contexts, then closes its own browser and server. It does
not use personal browser profiles, credentials, services or an existing app port.

Optional PowerShell overrides for an already installed browser and private evidence path:

```powershell
$env:FORMS_BROWSER_CHANNEL = 'msedge'
$env:FORMS_QA_OUTPUT = Join-Path $env:TEMP 'react-forms-checks'
npm test --prefix tests
```

`FORMS_BROWSER_EXECUTABLE` may instead specify an installed Chromium-family executable.
With neither browser override, the runner uses the Chromium installed by Playwright.
The output contains a JSON receipt plus full-page light/dark screenshots at four widths.

The test build must stay current: rerun `npm run build` after editing the app.
