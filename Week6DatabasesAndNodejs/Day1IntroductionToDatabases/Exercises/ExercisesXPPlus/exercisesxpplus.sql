-- exercisesxpplus.sql
-- Purpose: Create PostgreSQL database objects for XP+ Students exercise, insert data, and run the required queries.
-- Date: 2025-10-18 | TZ: Asia/Jerusalem

-- =====================================================================
-- STEP 1) (psql only) Create the database (skip in pgAdmin if already created)
-- =====================================================================
-- CREATE DATABASE bootcamp;

-- =====================================================================
-- STEP 2) Ensure we're using the default schema inside the selected DB
-- =====================================================================
SET search_path TO public;

-- Clean re-runs: drop the table if it exists
DROP TABLE IF EXISTS public.students CASCADE;

-- Create the students table
CREATE TABLE public.students (
    id          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    first_name  TEXT NOT NULL,
    last_name   TEXT NOT NULL,
    birth_date  DATE NOT NULL
);

-- Insert the required rows (dates converted to ISO yyyy-mm-dd)
INSERT INTO public.students (first_name, last_name, birth_date) VALUES
    ('Marc',   'Benichou', '1998-11-02'),
    ('Yoan',   'Cohen',    '2010-12-03'),
    ('Lea',    'Benichou', '1987-07-27'),
    ('Amelia', 'Dux',      '1996-04-07'),
    ('David',  'Grez',     '2003-06-14'),
    ('Omer',   'Simpson',  '1980-10-03');

-- Insert your own row (adapt if you prefer a different name or date)
INSERT INTO public.students (first_name, last_name, birth_date) VALUES
    ('Kevin', 'Cusnir', '1994-06-16');

-- ========================
-- Required SELECT queries
-- ========================

-- 1) Fetch all of the data from the table
SELECT * FROM public.students ORDER BY id;

-- 2) Fetch all of the students first_names and last_names
SELECT first_name, last_name FROM public.students ORDER BY id;

-- For the following questions, only fetch first_name and last_name

-- a) Student with id = 2
SELECT first_name, last_name FROM public.students WHERE id = 2;

-- b) last_name = 'Benichou' AND first_name = 'Marc'
SELECT first_name, last_name FROM public.students
WHERE last_name = 'Benichou' AND first_name = 'Marc';

-- c) last_name = 'Benichou' OR first_name = 'Marc'
SELECT first_name, last_name FROM public.students
WHERE last_name = 'Benichou' OR first_name = 'Marc'
ORDER BY last_name, first_name;

-- d) first_names contain the letter 'a' (case-insensitive)
SELECT first_name, last_name FROM public.students
WHERE first_name ILIKE '%a%'
ORDER BY first_name;

-- e) first_names start with the letter 'a' (case-insensitive)
SELECT first_name, last_name FROM public.students
WHERE first_name ILIKE 'a%'
ORDER BY first_name;

-- f) first_names end with the letter 'a' (case-insensitive)
SELECT first_name, last_name FROM public.students
WHERE first_name ILIKE '%a'
ORDER BY first_name;

-- g) second to last letter of first_name is 'a'
SELECT first_name, last_name FROM public.students
WHERE first_name ILIKE '%a_'
ORDER BY first_name;

-- h) ids equal to 1 AND 3 (i.e., in the set (1, 3))
SELECT first_name, last_name FROM public.students
WHERE id IN (1, 3)
ORDER BY id;

-- i) birth_dates equal to or after 2000-01-01 (show all info)
SELECT * FROM public.students
WHERE birth_date >= '2000-01-01'
ORDER BY birth_date, id;
