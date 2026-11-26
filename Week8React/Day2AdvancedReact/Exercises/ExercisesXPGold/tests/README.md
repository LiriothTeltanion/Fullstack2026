# Lifecycle integration checks

Run `npm test` from the parent ExercisesXPGold directory after `npm ci`.
Node's built-in test runner renders the real React 18 component tree in JSDOM,
compiling JSX in memory. A simulated clock makes the one-second timers immediate.

The four checks cover normal updates, the visible-color snapshot after blocked
renders, StrictMode cleanup without false alerts, and exactly one Child alert
after an explicit Delete. They also check class/hook timer cleanup and reject
unexpected fetch calls. Tests run offline and write no files to the project.
Use `npm run build` separately to verify the production bundle; JSDOM does not
replace a real-browser visual or accessibility review.
