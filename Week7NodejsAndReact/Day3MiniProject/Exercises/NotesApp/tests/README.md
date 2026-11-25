# Notes API regression checks

Run npm install from the project folder, then node --test tests/notes-http.test.js.

The suite starts the real HTTP application in a temporary copy with its own data file and loopback port. It covers normal CRUD, invalid input, concurrent writes, valid snapshots during saves, malformed JSON and recovery after internal errors. The temporary server and fixture are removed after the run.

Mutation ordering is guaranteed within one Node process. Separate server processes need shared transactional storage.
