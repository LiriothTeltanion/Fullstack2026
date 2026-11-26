# Generic hook fixture

`generic.html` and `generic.jsx` mount a minimal caller of the actual
`src/hooks/useLocalStorage.js` module. They verify that optional note validation
does not change object, array, null or functional-setter behavior for other
callers. The browser test builds this fixture with the app's existing Vite/React
configuration into ignored `tests/dist`; it is not added to the normal app UI.
All values are synthetic and every test uses a separate browser context.
