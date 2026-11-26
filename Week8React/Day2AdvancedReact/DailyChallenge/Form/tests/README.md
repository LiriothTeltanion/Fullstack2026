# Form tests

Run `npm test` from this exercise folder. Node tests cover prefix matching, case/whitespace, empty/no-match input, diacritics, immutable country data and the retained sign-up validation. They do not mount React. The class combobox is also checked in a real browser for arrows, selection, Escape, Tab/blur, pointer input, clearing and small viewports; browser evidence is kept privately rather than claiming these Node tests cover rendering. All inputs are synthetic; no requests or account registrations are made.

`autocomplete.test.js` adds six component regressions to the original five tests.
It uses Vite (already an app dependency) to transform JSX and React DOM's static
renderer to check markup. It also drives the class's state transitions directly
with a synchronous test updater. It verifies supplied-list counts, unique IDs and
ARIA targets across two instances, replacement of an open list, removal of a
selected country, stale Enter/pointer guards, composition input and reset before
refocusing. These are focused state/markup tests, not a substitute for mounted DOM
or screen-reader testing. No additional package or lockfile is needed.
