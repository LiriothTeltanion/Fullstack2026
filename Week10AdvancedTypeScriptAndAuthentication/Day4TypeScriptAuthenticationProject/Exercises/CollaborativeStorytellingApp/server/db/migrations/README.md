# Hosted comments migration

1. Apply the general [schema](../schema.sql) through [db setup](../init.js) using
   the database owner. For an existing deployment, retain its configured schema.
2. Establish the existing restricted backend runtime roles and their base-table
   permissions through the deployment's owner-only role setup.
3. With the database owner, apply [story-comments-hosted.sql](story-comments-hosted.sql)
   to the existing `storytelling` schema before deploying the comments routes.

The current exercise setup uses existing free-tier services; this SQL creates no
paid resource and does not change a plan or billing. It adds only the comments
table, its per-story index and cascade relationships. Reapplying it is supported.

The two existing backend roles receive `SELECT` and `INSERT` on comments and
sequence `USAGE`. They receive no direct comment `UPDATE` or `DELETE` grant.
Story deletion removes its comments through the foreign key. RLS follows the
existing backend-role policy; public/browser roles receive no table or sequence
access. Express still authenticates callers and determines story visibility.

This comments-only migration does not alter users or backfill account data.
Older accounts may retain a null email under the general schema; new-account
email validation is handled separately by authentication. No credentials or
project-specific service identifiers belong in this directory.


### Comment lifecycle

Apply `story-comment-lifecycle-hosted.sql` as the database owner after
`story-comments-hosted.sql`. It grants backend-only `UPDATE(body)`/`DELETE`
without changing existing rows, public roles or RLS. The application supplies
per-user authorization; the shared runtime login is not an end-user identity.
Both migrations are executed twice by the disposable PGlite comments fixture.
No test connects to a configured or hosted database.
