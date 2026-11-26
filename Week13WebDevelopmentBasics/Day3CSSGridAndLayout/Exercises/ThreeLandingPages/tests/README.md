# Responsive landing page regression tests

These tests serve the real static pages on a loopback HTTP server. They use no production service, personal data or external network.

```sh
cd tests
npm ci
npm test
```

Windows uses installed Microsoft Edge. Other platforms use Playwright Chromium: run `npx playwright install chromium` once. `PW_CHANNEL` can select an installed browser.

The suite covers all four pages at 1280, 768, 701, 700, 390 and 320 pixels: no horizontal overflow, local navigation, keyboard activation of hub links, real section targets, and the responsive travel cards. Phone cards must stack after the hero; desktop cards must keep their original overlap. Screenshots and JSON results use ignored `test-results/`.

An optional first argument to `layout.browser.cjs` selects another copy of the exercise. Running the same test against the original published folder reproduces the travel overflow/stacking regression.
