-- Starter table. Rename "items" to the main resource of the project.
DROP TABLE IF EXISTS items;

CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  title VARCHAR(120) NOT NULL,
  done BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO items (title) VALUES
  ('Write the project scope'),
  ('Design the database tables'),
  ('Build the first API route');

SELECT * FROM items ORDER BY id;
