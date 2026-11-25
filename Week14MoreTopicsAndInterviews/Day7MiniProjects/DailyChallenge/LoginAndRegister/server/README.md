# Express and PostgreSQL API

See the [project instructions](../README.md) for setup. `app.js` defines the REST routes, `userModel.js` owns the two-table transaction and `db.js` configures Knex's PostgreSQL connection. `server.js` is the normal listener.

Run `npm test` for an isolated PostgreSQL wire-protocol integration test, or `npm run dev:fixture` for a local development database and API. The fixture uses one connection because PGlite is a single-connection engine behind its socket adapter.
