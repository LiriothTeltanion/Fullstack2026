-- Apply after story-comments-hosted.sql with the database owner, never the runtime login.
-- This grants only comment editing/moderation; browser roles remain excluded.
BEGIN;
GRANT UPDATE (body), DELETE ON storytelling.story_comments
  TO storytelling_runtime, storytelling_render;
COMMIT;
