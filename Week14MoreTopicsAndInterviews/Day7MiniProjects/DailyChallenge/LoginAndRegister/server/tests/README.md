# PostgreSQL integration tests

Run `npm test` from the server folder. The test uses PGlite through a TCP PostgreSQL socket, Knex and the real Express app. Each run creates a disposable database. It checks profile responses, bcrypt storage, validation, duplicate accounts, successful/failed sign-in, rollback after a failed second insert, concurrent duplicates and database errors.
