# Local SQLite state

The server creates auth.sqlite here unless AUTH_DB_FILE selects another location. Database and journal files are git-ignored. Signing values belong in the local environment and must be preserved when testing restart continuity.
