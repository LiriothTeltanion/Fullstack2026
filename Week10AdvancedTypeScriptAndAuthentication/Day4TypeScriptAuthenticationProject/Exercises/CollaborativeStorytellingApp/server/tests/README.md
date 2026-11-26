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
