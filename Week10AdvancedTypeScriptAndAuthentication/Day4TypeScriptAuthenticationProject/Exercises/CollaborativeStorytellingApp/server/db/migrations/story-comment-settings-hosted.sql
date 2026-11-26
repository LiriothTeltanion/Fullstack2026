-- OPT-IN only: review with the database owner after the existing comment migrations.
-- Never run this automatically during startup or deployment.
-- Existing stories keep accepting comments. Existing comments are not changed.
BEGIN;
ALTER TABLE storytelling.stories
  ADD COLUMN IF NOT EXISTS comments_open BOOLEAN NOT NULL DEFAULT TRUE;
GRANT SELECT (comments_open), UPDATE (comments_open) ON storytelling.stories
  TO storytelling_runtime, storytelling_render;
COMMIT;
