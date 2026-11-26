# Browser regression tests

These tests exercise the production build through real browser interactions. They use an isolated browser context per scenario and a read-only loopback server on an ephemeral port. The exact Picsum list API and two image URLs are fulfilled with deterministic responses and original SVG fixtures; no request reaches that external service. Every other external request is blocked and fails the test. No API credentials or remote image provider is needed for validation.

From the exercise directory:

Use Node.js 20 or newer for the browser test tooling.

```bash
npm install
npm run build
npm ci --prefix tests
npm exec --prefix tests -- playwright install chromium
npm test
```

The test dependency is pinned in `tests/package-lock.json`, separately from the application's Vite tooling. The default browser is Playwright Chromium. To use an already installed Microsoft Edge instead, set `BROWSER_CHANNEL=msedge` before running tests. `TEST_ARTIFACT_DIR` optionally saves full-page desktop/mobile screenshots and a JSON result receipt outside the repository.

Coverage includes both responsive layouts; two loaded images; real paragraph render failure; preserving unaffected content and reloading images while that paragraph has failed; recovery without an immediate repeat failure; locally handled event errors; loading, invalid API response, labelled fallback, invalid local feed, failed network and retry; remote-image failure recovery; all three original counter simulations; and whole-app recovery. Expected render/event demonstration messages are accepted narrowly; unexplained page errors and failed local resources fail the tests. Failed-network cases intentionally abort the fallback JSON request or the mocked image URLs. External-service availability is a separate smoke check, not a prerequisite for these regression tests.
