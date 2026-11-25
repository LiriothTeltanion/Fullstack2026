# Exercises XP — dvdrental Relationships & Queries (PostgreSQL)

This pack contains a single SQL file with commented solutions for both exercises.
Emojis are used for section markers (no hearts).

## How to run
### pgAdmin
1) Open the **dvdrental** database (restore if needed).
2) Query Tool → open `xp_dvdrental_relationships.sql` (folder icon) → execute.

### psql
```bash
psql -d dvdrental -f xp_dvdrental_relationships.sql
```

## Notes
- The file is idempotent where possible; DDL uses `IF EXISTS/IF NOT EXISTS`.
- Some statements (like changing film languages) are examples; adjust titles/ids to your data if you’ve modified it.
