# Notes CLI tests

Run `npm test` from the NotesApp directory after `npm ci`. Each behavior test runs
the real `node app` command in separate Node processes and supplies a notes file
inside its own disposable operating-system temporary directory. No private notes
or default user file are read. An explicit preload guard rejects network calls
in each CLI child command. The normal test runner remains available for future
HTTP tests that need a disposable loopback server; it has no global network
preload. Use `npm run test:cli` to select just the CLI suite.

Coverage includes add/list/read/remove persistence, Unicode/multiline bodies,
duplicate and missing titles, invalid commands/options, required arguments,
read-only help/list, title matching, corrupt-file retention, writer-lock retention
and preservation of the existing web demo's JSON fixture. Tests remove only their
own verified temporary directories. The suite does not start the Express server
or establish that a course chapter has been submitted or approved.
