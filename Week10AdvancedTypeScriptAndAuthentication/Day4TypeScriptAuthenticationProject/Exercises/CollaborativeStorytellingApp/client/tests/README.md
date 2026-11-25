# Client route tests

Run from the `client` directory with Node.js 22.13 or newer:

```sh
node --experimental-strip-types --test tests/routes.test.mjs
```

The three isolated tests cover static page URLs, detail/edit story IDs, invalid
routes and safe local login return paths. They import the pure route parser and
do not start a server, read credentials or contact a configured database.

These tests complement the TypeScript/Vite build and browser checks of history,
deep links, account flows and theme persistence; they do not replace those checks.
