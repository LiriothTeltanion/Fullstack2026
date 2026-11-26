# Focused practice tests

Run `npm ci` and `npm test`. The Node tests cover custom validation with independent valid/invalid examples, password-free preview data, timer scheduling/current-time behavior and idempotent cleanup, plus the preserved quote picker. They use no browser, credentials or external services. The normal UI is available through `npm run dev`; a production bundle can be checked with `npm run build` and `npm run preview`.
