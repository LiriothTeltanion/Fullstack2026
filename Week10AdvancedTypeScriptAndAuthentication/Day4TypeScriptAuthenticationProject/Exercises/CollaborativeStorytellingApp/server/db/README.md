# 📦 PostgreSQL schema

<img src="../../../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

Apply [schema.sql](schema.sql) to a new local database. Users have unique lowercase usernames. Stories reference their author. The contributor table has a unique story/user pair and cascades with story deletion.

[init.js](init.js) applies the schema. Refresh sessions persist one rotating token ID per session.

The schema is additive and can be applied again. Existing API field names stay camelCase while SQL columns use snake_case.

## Story comments

`db:setup` also creates `story_comments`, its chronological per-story index and
foreign keys. Deleting a story cascades to its comments in PostgreSQL and in the
explicit in-memory demonstration mode. The database enforces the 1–2000-character
limit; the API also trims outside whitespace and rejects blank/non-string input.

For the existing hosted `storytelling` schema, apply
[the comments-only migration](migrations/story-comments-hosted.sql) with the database
owner before deploying the comments routes. It is additive and repeatable. Only
the existing `storytelling_runtime` and `storytelling_render` backend roles receive
comment read/write privileges; public/browser roles receive none. Its RLS policy
matches the existing backend-role policy, with application authentication and
story visibility enforced by Express. There is no public comment mutation API
outside the authenticated story routes.
