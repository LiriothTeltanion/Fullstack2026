-- Run once in psql or pgAdmin on the database from .env (w7d2_blog).
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS books;

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  author VARCHAR(120) NOT NULL,
  published_year INTEGER
);

INSERT INTO posts (title, content) VALUES
  ('Hello Knex', 'My first post saved through a query builder.'),
  ('Routes and models', 'The model talks to the database, the controller talks to HTTP.');

INSERT INTO books (title, author, published_year) VALUES
  ('The Hobbit', 'J.R.R. Tolkien', 1937),
  ('Dune', 'Frank Herbert', 1965);
