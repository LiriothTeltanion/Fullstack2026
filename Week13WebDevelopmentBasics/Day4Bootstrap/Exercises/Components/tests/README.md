# Components regression checks

`npm test` verifies the exact preserved gallery, its unchanged support files,
the historical documentation, the licensed Bootstrap asset, and the main page's
connection/form policy. These checks use only Node built-ins.

`npm run test:browser` starts its own temporary loopback static server and a fresh
Playwright browser context. It checks desktop and mobile layout, fixed positioning,
menu keyboard focus, collapse, detail controls and a form activation that clears
synthetic input without reading, storing or transmitting it. Requests to another
origin are blocked and fail the test. The historical gallery is hash-checked,
not loaded, because its byte-preserved source still uses CDN dependencies.

Use `BROWSER_EXECUTABLE` for an installed Chromium or Edge executable. Set
`PLAYWRIGHT_MODULE_PATH` to an existing Playwright module if dependencies are
supplied by a separate test environment. Without these variables the suite uses
the project's pinned Playwright package and its default Chromium browser.
Screenshots and a compact receipt go to ignored `.qa/`; set `QA_OUTPUT_DIR` to
choose a different private output directory. The server and browser always close.

The checks establish local behavior. They do not claim a deployment, a campus
submission, an academic grade, an authentication service, or personal mastery.
