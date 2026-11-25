-- Daily Challenge: Actors (PostgreSQL)
-- Self-contained: creates its own table, so it runs in any empty database.
--   psql -d actors_challenge -f actors.sql

DROP TABLE IF EXISTS actors;

CREATE TABLE actors (
  actor_id      SERIAL PRIMARY KEY,
  first_name    VARCHAR(50)  NOT NULL,
  last_name     VARCHAR(100) NOT NULL,
  birth_date    DATE         NOT NULL,
  number_oscars SMALLINT     NOT NULL
);

INSERT INTO actors (first_name, last_name, birth_date, number_oscars) VALUES
  ('Matt',   'Damon',    '1970-10-08', 5),
  ('George', 'Clooney',  '1961-05-06', 2),
  ('Meryl',  'Streep',   '1949-06-22', 3),
  ('Denzel', 'Washington', '1954-12-28', 2),
  ('Cate',   'Blanchett', '1969-05-14', 2);

-- 1. How many actors are in the table?
SELECT COUNT(*) AS number_of_actors FROM actors;
-- Result: 5

-- 2. Try to add an actor with some blank fields.
--    Every column is NOT NULL, so PostgreSQL refuses the row:
--    ERROR:  null value in column "birth_date" of relation "actors" violates not-null constraint
INSERT INTO actors (first_name, last_name, birth_date, number_oscars)
VALUES ('Ryan', 'Gosling', NULL, NULL);

-- 3. An empty string is not NULL, so this one is accepted.
--    NOT NULL only stops missing values; a CHECK is needed to stop empty text.
INSERT INTO actors (first_name, last_name, birth_date, number_oscars)
VALUES ('', 'Unknown', '2000-01-01', 0);

SELECT COUNT(*) AS number_of_actors FROM actors;
-- Result: 6 (the empty-name row got in, the NULL row did not)

-- 4. Add that CHECK, remove the bad row first, then try again.
DELETE FROM actors WHERE first_name = '';
ALTER TABLE actors ADD CONSTRAINT first_name_not_empty CHECK (first_name <> '');

INSERT INTO actors (first_name, last_name, birth_date, number_oscars)
VALUES ('', 'Unknown', '2000-01-01', 0);
-- ERROR:  new row for relation "actors" violates check constraint "first_name_not_empty"

-- 5. The final list, most Oscars first
SELECT first_name, last_name, number_oscars
FROM actors
ORDER BY number_oscars DESC, last_name;
