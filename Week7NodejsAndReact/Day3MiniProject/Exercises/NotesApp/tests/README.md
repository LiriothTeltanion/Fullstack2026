# Notes regression tests

From the NotesApp directory, install the locked dependencies with `npm ci` and run `npm test` to exercise both interfaces.

## CLI

Run `npm run test:cli` to select the command-line suite. Each test starts the real
`node app` command in a separate process with a disposable notes file. A preload
guard rejects network calls in each CLI child. The suite checks add, list, read and
remove across processes, Unicode and multiline text, duplicate or missing titles,
invalid commands and options, title matching, read-only help and list, corrupt files,
writer locks, and preservation of the web demo fixture.

## HTTP API

Run `node --test tests/notes-http.test.js` to select the HTTP suite. It starts the real
Express app on a loopback port in a temporary copy with its own data file. Tests
cover CRUD, invalid input, concurrent writes, valid snapshots during saves,
malformed JSON, and recovery after internal errors. Each suite cleans up its own
temporary data. The server serializes mutations within one process. Multiple server
processes would need shared transactional storage.
