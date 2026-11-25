CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(20) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  CHECK (username = lower(username))
);

-- Existing accounts can still log in with their original username. New signups
-- supply a normalized email and the index enforces uniqueness across requests.
ALTER TABLE users ADD COLUMN IF NOT EXISTS email TEXT
  CONSTRAINT users_email_normalized CHECK (email = lower(btrim(email)));
CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique ON users (lower(email))
  WHERE email IS NOT NULL;

CREATE TABLE IF NOT EXISTS stories (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS story_contributors (
  id SERIAL PRIMARY KEY,
  story_id INTEGER NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id),
  UNIQUE (story_id, user_id)
);

CREATE TABLE IF NOT EXISTS refresh_sessions (
  id UUID PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL
);

-- The CSRF session must survive process restarts and separate hosting instances.
CREATE TABLE IF NOT EXISTS http_sessions (
  sid VARCHAR PRIMARY KEY,
  sess JSON NOT NULL,
  expire TIMESTAMP(6) NOT NULL
);
CREATE INDEX IF NOT EXISTS http_sessions_expire_idx ON http_sessions (expire);

-- Discussion belongs to the story and disappears when that story is deleted.
CREATE TABLE IF NOT EXISTS story_comments (
  id SERIAL PRIMARY KEY,
  story_id INTEGER NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 2000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS story_comments_story_created_idx
  ON story_comments (story_id, created_at, id);
