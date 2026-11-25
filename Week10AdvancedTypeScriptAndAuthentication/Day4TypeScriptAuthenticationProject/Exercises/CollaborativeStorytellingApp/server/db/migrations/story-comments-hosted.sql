-- Apply once (or again safely) with the database owner after the base schema.
-- Only comments are provisioned here; existing users and stories are preserved.
BEGIN;

CREATE TABLE IF NOT EXISTS storytelling.story_comments (
  id SERIAL PRIMARY KEY,
  story_id INTEGER NOT NULL REFERENCES storytelling.stories(id) ON DELETE CASCADE,
  author_id INTEGER NOT NULL REFERENCES storytelling.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 2000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS story_comments_story_created_idx
  ON storytelling.story_comments (story_id, created_at, id);

REVOKE ALL ON storytelling.story_comments FROM PUBLIC, anon, authenticated, service_role;
REVOKE ALL ON SEQUENCE storytelling.story_comments_id_seq
  FROM PUBLIC, anon, authenticated, service_role;
GRANT USAGE ON SCHEMA storytelling TO storytelling_runtime, storytelling_render;
GRANT SELECT, INSERT ON storytelling.story_comments
  TO storytelling_runtime, storytelling_render;
GRANT USAGE ON SEQUENCE storytelling.story_comments_id_seq
  TO storytelling_runtime, storytelling_render;

ALTER TABLE storytelling.story_comments ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storytelling'
      AND tablename = 'story_comments'
      AND policyname = 'storytelling_backend'
  ) THEN
    ALTER POLICY storytelling_backend ON storytelling.story_comments
      TO storytelling_runtime, storytelling_render USING (true) WITH CHECK (true);
  ELSE
    -- Match the existing backend-role policy: application routes enforce identity
    -- and story visibility; direct browser/database roles have no table grants.
    CREATE POLICY storytelling_backend ON storytelling.story_comments
      FOR ALL TO storytelling_runtime, storytelling_render
      USING (true) WITH CHECK (true);
  END IF;
END
$$;

COMMIT;
