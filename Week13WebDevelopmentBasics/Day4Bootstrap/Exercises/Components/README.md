# Components · responsive Bootstrap layout

A small, accessible Bootstrap layout with fixed navigation, a full-width hero,
three responsive columns and working disclosure controls. The sign-in-shaped
form is a **local demonstration**: use made-up values; it does not authenticate,
read field values, save them, or send a request.

## Run

From this directory, run `python -m http.server 8000 --bind 127.0.0.1`, then open
<http://127.0.0.1:8000>. The main page needs no package install or internet access.
Its Bootstrap 5.3.3 stylesheet is vendored with its MIT license.

- Fixed navbar: three section links, About initially active, Contact demo badge,
  a keyboard-operable dropdown and a right-aligned desktop demo form.
- Full-width introduction with a primary link to the examples.
- Three columns, each with an original inline icon and a working detail button;
  the third includes a New badge.
- At smaller widths the navigation collapses and the columns stack. Text zoom,
  a skip link, focus outlines, descriptive labels and reduced motion are supported.
- Clicking the demo form button, or submitting with the keyboard, clears the
  fields and displays an explanation. No credentials are read or stored. The
  page's Content Security Policy also blocks connections and form navigation.

## Tests

```sh
npm ci
npm test
npm run test:browser
```

The browser suite uses Playwright and a temporary loopback-only static server.
Set `BROWSER_EXECUTABLE` to a local Chromium/Edge executable, or install a
Playwright Chromium browser with `npx playwright install chromium`. An existing
Playwright installation can be supplied through `PLAYWRIGHT_MODULE_PATH`.
The suite rejects external requests and checks the layout, keyboard dropdown,
mobile menu, details, fixed header, form privacy, and original-file hashes.
[Tests and boundaries](tests/README.md) explain the fixtures.

## Preserved original gallery

[gallery.html](gallery.html) is a byte-for-byte copy of the previous `index.html`
from repository commit `148d3797160d758ecaf35e894b478f6b36b9f4c3`.
Its SHA-256 is `1b873b932e7fc24afe2ec6ef68805d9af5c930877c2b547e48d72cbe3afb5c7a`.
The original [app.js](app.js), [style.css](style.css), and historical
[gallery documentation](GALLERY.md) are preserved. The new entry uses separate
`layout.js` and `layout.css`, so it does not change the older experiment.

**Gallery limitation:** the historical file retains its original CDN stylesheet
and Bootstrap bundle URLs. Opening it requires internet access. The offline and
no-network checks apply to the new main layout, not to that preserved artifact.
No source course prompt, credentials, remote account or academic status is
included in this exercise.

## Explain it

Compare a fixed header with a sticky header; then explain why a form-shaped
layout can demonstrate validation and accessibility without creating an account
or transmitting anything. Try the page at 390 px and 1280 px with the network
turned off.

Built with AI-assisted tooling; I reviewed, tested and can explain every change.
