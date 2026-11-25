-- Daily Challenge: SQL Puzzle (PostgreSQL)
-- Predict each COUNT before running it. The trap is NULL inside NOT IN.
--   psql -d puzzle -f sql_puzzle.sql

DROP TABLE IF EXISTS first_tab;
DROP TABLE IF EXISTS second_tab;

CREATE TABLE first_tab (
  id   INTEGER,
  name VARCHAR(10)
);

INSERT INTO first_tab VALUES
  (5, 'Pawan'),
  (6, 'Sharlee'),
  (7, 'Krish'),
  (NULL, 'Avtaar');

CREATE TABLE second_tab (
  id INTEGER
);

INSERT INTO second_tab VALUES
  (5),
  (NULL);

-- Q1: the subquery returns only NULL.
--     "id NOT IN (NULL)" means "id <> NULL", which is never TRUE (it is UNKNOWN).
--     Answer: 0
SELECT COUNT(*) AS q1
FROM first_tab AS ft
WHERE ft.id NOT IN (SELECT id FROM second_tab WHERE id IS NULL);

-- Q2: the subquery returns only 5.
--     6 and 7 are not 5, so they count. The NULL id gives UNKNOWN and is left out.
--     Answer: 2
SELECT COUNT(*) AS q2
FROM first_tab AS ft
WHERE ft.id NOT IN (SELECT id FROM second_tab WHERE id = 5);

-- Q3: the subquery returns 5 and NULL.
--     For 6: "6 <> 5 AND 6 <> NULL" -> TRUE AND UNKNOWN -> UNKNOWN. Nothing passes.
--     Answer: 0
SELECT COUNT(*) AS q3
FROM first_tab AS ft
WHERE ft.id NOT IN (SELECT id FROM second_tab);

-- Q4: the NULL is filtered out inside the subquery, so it returns only 5 again.
--     Answer: 2
SELECT COUNT(*) AS q4
FROM first_tab AS ft
WHERE ft.id NOT IN (SELECT id FROM second_tab WHERE id IS NOT NULL);

-- Bonus: NOT EXISTS does not have the NULL trap.
-- It keeps 6, 7 and the row with a NULL id, because no row in second_tab equals them.
-- Answer: 3
SELECT COUNT(*) AS bonus_not_exists
FROM first_tab AS ft
WHERE NOT EXISTS (SELECT 1 FROM second_tab AS st WHERE st.id = ft.id);
