# 📦 PostgreSQL schema

<img src="../../../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

Apply [schema.sql](schema.sql) to a new local database. Users have unique lowercase usernames. Stories reference their author. The contributor table has a unique story/user pair and cascades with story deletion.

[init.js](init.js) applies the schema. Refresh sessions persist one rotating token ID per session.

The schema is additive and can be applied again. Existing API field names stay camelCase while SQL columns use snake_case.
