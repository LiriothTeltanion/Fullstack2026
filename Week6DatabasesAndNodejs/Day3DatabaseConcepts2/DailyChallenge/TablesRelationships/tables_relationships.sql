-- Daily Challenge: Tables Relationships (PostgreSQL)
-- Part I is one-to-one, Part II is many-to-many. Self-contained.
--   psql -d relationships -f tables_relationships.sql

DROP TABLE IF EXISTS library;
DROP TABLE IF EXISTS book;
DROP TABLE IF EXISTS student;
DROP TABLE IF EXISTS customer_profile;
DROP TABLE IF EXISTS customer;

/* ---------------------------------------------------------------
   Part I: one customer has at most one profile (one-to-one)
--------------------------------------------------------------- */

CREATE TABLE customer (
  id         SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name  VARCHAR(50) NOT NULL
);

-- UNIQUE on customer_id is what makes it one-to-one instead of one-to-many
CREATE TABLE customer_profile (
  id           SERIAL PRIMARY KEY,
  is_logged_in BOOLEAN NOT NULL DEFAULT FALSE,
  customer_id  INTEGER NOT NULL UNIQUE REFERENCES customer (id) ON DELETE CASCADE
);

INSERT INTO customer (first_name, last_name) VALUES
  ('John', 'Doe'),
  ('Jerome', 'Lalu'),
  ('Lea', 'Rive');

-- Subqueries find the ids by name, so I don't hard-code them
INSERT INTO customer_profile (is_logged_in, customer_id) VALUES
  (TRUE,  (SELECT id FROM customer WHERE first_name = 'John')),
  (FALSE, (SELECT id FROM customer WHERE first_name = 'Jerome'));

-- 1. First names of the customers who are logged in
SELECT c.first_name
FROM customer AS c
JOIN customer_profile AS cp ON cp.customer_id = c.id
WHERE cp.is_logged_in;
-- John

-- 2. All customers and their login status, even the ones with no profile
SELECT c.first_name, cp.is_logged_in
FROM customer AS c
LEFT JOIN customer_profile AS cp ON cp.customer_id = c.id
ORDER BY c.id;
-- John true, Jerome false, Lea NULL

-- 3. How many customers are NOT logged in (no profile counts as not logged in)
SELECT COUNT(*) AS not_logged_in
FROM customer AS c
LEFT JOIN customer_profile AS cp ON cp.customer_id = c.id
WHERE cp.is_logged_in IS NOT TRUE;
-- 2

/* ---------------------------------------------------------------
   Part II: students borrow books (many-to-many through library)
--------------------------------------------------------------- */

CREATE TABLE book (
  book_id SERIAL PRIMARY KEY,
  title   VARCHAR(80) NOT NULL,
  author  VARCHAR(80) NOT NULL
);

CREATE TABLE student (
  student_id SERIAL PRIMARY KEY,
  name       VARCHAR(50) NOT NULL UNIQUE,
  age        SMALLINT    NOT NULL CHECK (age <= 15)
);

-- The junction table: its primary key is the pair of foreign keys
CREATE TABLE library (
  book_fk_id    INTEGER NOT NULL REFERENCES book (book_id) ON DELETE CASCADE ON UPDATE CASCADE,
  student_fk_id INTEGER NOT NULL REFERENCES student (student_id) ON DELETE CASCADE ON UPDATE CASCADE,
  borrowed_date DATE    NOT NULL,
  PRIMARY KEY (book_fk_id, student_fk_id)
);

INSERT INTO book (title, author) VALUES
  ('Alice In Wonderland', 'Lewis Carroll'),
  ('Harry Potter', 'J.K. Rowling'),
  ('To kill a mockingbird', 'Harper Lee');

INSERT INTO student (name, age) VALUES
  ('John', 12),
  ('Lera', 11),
  ('Patrick', 10),
  ('Bob', 14);

INSERT INTO library (book_fk_id, student_fk_id, borrowed_date) VALUES
  ((SELECT book_id FROM book WHERE title = 'Alice In Wonderland'),
   (SELECT student_id FROM student WHERE name = 'John'), '2022-02-15'),
  ((SELECT book_id FROM book WHERE title = 'To kill a mockingbird'),
   (SELECT student_id FROM student WHERE name = 'Bob'), '2021-03-03'),
  ((SELECT book_id FROM book WHERE title = 'Alice In Wonderland'),
   (SELECT student_id FROM student WHERE name = 'Lera'), '2021-05-23'),
  ((SELECT book_id FROM book WHERE title = 'Harry Potter'),
   (SELECT student_id FROM student WHERE name = 'Bob'), '2021-08-12');

-- 4. Everything in the junction table
SELECT * FROM library;

-- 5. Student name and book title for every loan
SELECT s.name, b.title, l.borrowed_date
FROM library AS l
JOIN student AS s ON s.student_id = l.student_fk_id
JOIN book AS b ON b.book_id = l.book_fk_id
ORDER BY l.borrowed_date;

-- 6. Average age of the children who borrowed Alice In Wonderland
SELECT ROUND(AVG(s.age), 1) AS average_age
FROM library AS l
JOIN student AS s ON s.student_id = l.student_fk_id
JOIN book AS b ON b.book_id = l.book_fk_id
WHERE b.title = 'Alice In Wonderland';
-- (12 + 11) / 2 = 11.5

-- 7. Delete a student: ON DELETE CASCADE removes his loans from library too
DELETE FROM student WHERE name = 'Bob';
SELECT * FROM library;
-- Bob's two loans are gone, two rows are left
