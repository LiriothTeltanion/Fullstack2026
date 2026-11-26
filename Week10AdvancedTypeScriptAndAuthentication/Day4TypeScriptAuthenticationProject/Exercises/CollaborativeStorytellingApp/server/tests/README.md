# Session persistence regression

Run `npm ci` and `npm test` from the server folder.

The tests execute the real `connect-pg-simple` queries in embedded PostgreSQL
(PGlite). They verify persistence after closing and reopening database files,
touch, deletion, expired-session rejection and explicit cleanup. Temporary files
are confined to a newly created directory below the OS temporary directory.

The fixture adapter implements the `pg.Pool.query` boundary; it does not exercise
the native PostgreSQL TCP/TLS driver. Hosted deployment QA verifies that driver
separately. This suite never connects to `DATABASE_URL`.

The comments fixtures also exercise author-only editing, comment/story-author
deletion, collaborator and unrelated-reader denial, story scoping, Unicode
boundaries, invalid edits without mutation and stale IDs. Model writes repeat
the identity predicate. The hosted lifecycle migration is repeatable, limits
UPDATE to the body column and keeps browser/database API roles denied.

## New-comment settings

`npm test` also exercises the in-memory HTTP settings contract: author-only
close/reopen, invalid input without mutation, retained comments and editing, and
retry after reopening. The existing PGlite suite keeps testing the older schema.

For the native PostgreSQL variant, set `STORY_SETTINGS_TEST_DATABASE_URL` to a
**disposable loopback-only database** and run `node --test tests/commentSettings.test.js`.
The test never reads `.env`, creates a random schema and synthetic accounts/roles,
then drops only that schema and its own roles. The database login must be able to
create schemas and fixture roles. Do not point it at an existing application database.
It checks the optional migration twice, narrow column grants, capability loss,
and both posting/closing orders using two native connections. A third connection
observes a waiting advisory lock before releasing the first operation. This
native variant is opt-in and is not silently represented by the PGlite tests.
