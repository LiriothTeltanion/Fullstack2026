# React state browser checks

These keyboard and form regression tests run against production builds of the Voting App and the first Exercises XP Gold app. They cover a tied vote, a change of leader, reset, invalid names and email addresses, draft preservation and a valid signup preview. Each test runs at 320 px and at 1280 px.

From the repository root, install each example and the test runner, then run the checks:

```sh
npm --prefix Week7NodejsAndReact/Day5ReactComponentsAndState/DailyChallenge/VotingApp install --no-package-lock
npm --prefix Week7NodejsAndReact/Day5ReactComponentsAndState/Exercises/ExercisesXPGold ci
cd tests/browser/react-state
npm ci
npx playwright install chromium
npm test
```

The runner builds both examples and starts their previews on loopback ports 43175 and 43176. Both ports must be free. To use an installed Microsoft Edge instead of the downloaded Chromium, set `PLAYWRIGHT_CHANNEL` to `msedge` before running the tests.
