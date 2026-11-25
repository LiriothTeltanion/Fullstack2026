# Database setup and fixture

`schema.sql` creates the users/login tables in the exercise's dedicated database. `init.js` runs that schema using the configured PostgreSQL connection. `fixture.js` creates and closes a fresh PostgreSQL WASM database behind a loopback PostgreSQL socket for development and tests.
