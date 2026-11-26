# Compass clock checks

The production-page tests use Playwright as a normal local dependency and bind
their temporary HTTP server to `127.0.0.1` on an available port. Every external
request is blocked and fails the test. No account or service is needed.

From the exercise directory, after installing and building the application:

```bash
npm ci --prefix tests
npx --prefix tests playwright install chromium
npm run build
npm test --prefix tests
```

`npm run test:unit --prefix tests` runs the six date/angle tests without a browser.
The browser suite covers local time, seconds, date/year rollover, two timezones,
all three dial hands, interval cleanup/remount, the preserved widgets, keyboard
view selection, and 1440/390/320-pixel layouts. Time is controlled with
Playwright's clock API, not a test-only product endpoint or a real-time delay.

Optional PowerShell settings for a machine with Edge already installed:

```powershell
$env:BROWSER_CHANNEL = 'msedge'
$env:TEST_ARTIFACT_DIR = 'C:\path\outside-the-repository\clock-qa'
npm test --prefix tests
```

The browser executable override is optional. Module resolution always uses the
test package's pinned dependency. Screenshots and a JSON result file are emitted
only when `TEST_ARTIFACT_DIR` is set; keep private evidence outside Git.
