-- =============================================================
-- 📀 Exercises XP Gold — dvdrental (Relationships & Requests)
-- PostgreSQL SQL answers (run in dvdrental DB)
-- =============================================================

/* -------------------------------------------------------------
   🌟 Exercise 1 : DVD Rentals
------------------------------------------------------------- */

-- 1) List of all rentals which are out (not returned).
--    We identify "out" rentals by rental.return_date IS NULL.
SELECT r.rental_id, r.rental_date,
       c.customer_id, c.first_name, c.last_name,
       f.film_id, f.title
FROM rental AS r
JOIN customer AS c ON c.customer_id = r.customer_id
JOIN inventory AS i ON i.inventory_id = r.inventory_id
JOIN film     AS f ON f.film_id      = i.film_id
WHERE r.return_date IS NULL
ORDER BY r.rental_date DESC, r.rental_id;

-- 2) All customers who have not returned their rentals (grouped)
SELECT c.customer_id,
       c.first_name, c.last_name,
       COUNT(*) AS outstanding_count
FROM rental AS r
JOIN customer AS c ON c.customer_id = r.customer_id
WHERE r.return_date IS NULL
GROUP BY c.customer_id, c.first_name, c.last_name
ORDER BY outstanding_count DESC, c.last_name, c.first_name;

-- 3) All Action films with actor "Joe Swank"
--    Shortcut: create a view that pre-joins film, actor, category.
DROP VIEW IF EXISTS vw_film_actor_category;
CREATE VIEW vw_film_actor_category AS
SELECT f.film_id, f.title, f.description,
       a.actor_id, a.first_name AS actor_first, a.last_name AS actor_last,
       c.category_id, c.name AS category_name
FROM film AS f
JOIN film_actor   AS fa ON fa.film_id   = f.film_id
JOIN actor        AS a  ON a.actor_id   = fa.actor_id
JOIN film_category AS fc ON fc.film_id  = f.film_id
JOIN category     AS c  ON c.category_id = fc.category_id;

-- Use the view (ILIKE for case-insensitive match)
SELECT DISTINCT film_id, title
FROM vw_film_actor_category
WHERE category_name = 'Action'
  AND actor_first ILIKE 'Joe'
  AND actor_last  ILIKE 'Swank'
ORDER BY title;

/* -------------------------------------------------------------
   🌟 Exercise 2 – Happy Halloween
------------------------------------------------------------- */

-- A) How many stores there are, and in which city & country they are located.
SELECT s.store_id,
       ci.city, co.country,
       a.address, a.address2, a.postal_code, a.phone
FROM store AS s
JOIN address AS a ON a.address_id = s.address_id
JOIN city    AS ci ON ci.city_id  = a.city_id
JOIN country AS co ON co.country_id = ci.country_id
ORDER BY s.store_id;

-- Total number of stores
SELECT COUNT(*) AS store_count FROM store;

-- B) Total hours of viewing time per store (sum of film.length for each inventory item),
--    EXCLUDING items currently out on rent (return_date IS NULL).
--    We count each physical inventory item once if it is *not* currently out.
WITH available_items AS (
  SELECT i.inventory_id, i.store_id, i.film_id
  FROM inventory AS i
  WHERE NOT EXISTS (
    SELECT 1 FROM rental AS r
    WHERE r.inventory_id = i.inventory_id
      AND r.return_date IS NULL
  )
)
SELECT s.store_id,
       SUM(f.length)::int                               AS total_minutes,
       ROUND(SUM(f.length)/60.0, 2)                     AS total_hours,
       ROUND(SUM(f.length)/(60.0*24), 2)                AS total_days
FROM available_items AS ai
JOIN film AS f ON f.film_id = ai.film_id
JOIN store AS s ON s.store_id = ai.store_id
GROUP BY s.store_id
ORDER BY s.store_id;

-- C) List of all customers in the cities where the stores are located.
SELECT DISTINCT cu.customer_id, cu.first_name, cu.last_name, ci.city
FROM customer AS cu
JOIN address  AS ca ON ca.address_id = cu.address_id
JOIN city     AS ci ON ci.city_id    = ca.city_id
WHERE ci.city_id IN (
  SELECT a.city_id
  FROM store AS st
  JOIN address AS a ON a.address_id = st.address_id
)
ORDER BY ci.city, cu.last_name, cu.first_name;

-- D) List of all customers in the countries where the stores are located.
SELECT DISTINCT cu.customer_id, cu.first_name, cu.last_name, co.country
FROM customer AS cu
JOIN address  AS ca ON ca.address_id = cu.address_id
JOIN city     AS ci ON ci.city_id    = ca.city_id
JOIN country  AS co ON co.country_id = ci.country_id
WHERE co.country_id IN (
  SELECT ci2.country_id
  FROM store AS st
  JOIN address AS a2 ON a2.address_id = st.address_id
  JOIN city    AS ci2 ON ci2.city_id   = a2.city_id
)
ORDER BY co.country, cu.last_name, cu.first_name;

-- E) "Safe list" of movies that are NOT in 'Horror' and do NOT contain
--    scary words in title/description; sum of their viewing time.
--    (We also compute minutes, hours, days.)

-- Helper: regex of scary words (case-insensitive): beast|monster|ghost|dead|zombie|undead
WITH scary_films AS (
  SELECT DISTINCT f.film_id
  FROM film AS f
  LEFT JOIN film_category AS fc ON fc.film_id = f.film_id
  LEFT JOIN category      AS c  ON c.category_id = fc.category_id
  WHERE c.name = 'Horror'
     OR f.title       ~* '(beast|monster|ghost|dead|zombie|undead)'
     OR f.description ~* '(beast|monster|ghost|dead|zombie|undead)'
),
safe_films AS (
  SELECT f.film_id, f.length
  FROM film AS f
  WHERE f.film_id NOT IN (SELECT film_id FROM scary_films)
)
SELECT
  SUM(length)::int                            AS safe_total_minutes,
  ROUND(SUM(length)/60.0, 2)                  AS safe_total_hours,
  ROUND(SUM(length)/(60.0*24), 2)             AS safe_total_days
FROM safe_films;

-- F) For comparison, general (all films) total viewing time.
SELECT
  SUM(length)::int                            AS general_total_minutes,
  ROUND(SUM(length)/60.0, 2)                  AS general_total_hours,
  ROUND(SUM(length)/(60.0*24), 2)             AS general_total_days
FROM film;

-- Optional: If you want a "safe list per store (available items only)" like in (B):
WITH available_items AS (
  SELECT i.inventory_id, i.store_id, i.film_id
  FROM inventory AS i
  WHERE NOT EXISTS (
    SELECT 1 FROM rental AS r
    WHERE r.inventory_id = i.inventory_id
      AND r.return_date IS NULL
  )
),
scary_films AS (
  SELECT DISTINCT f.film_id
  FROM film AS f
  LEFT JOIN film_category AS fc ON fc.film_id = f.film_id
  LEFT JOIN category      AS c  ON c.category_id = fc.category_id
  WHERE c.name = 'Horror'
     OR f.title       ~* '(beast|monster|ghost|dead|zombie|undead)'
     OR f.description ~* '(beast|monster|ghost|dead|zombie|undead)'
)
SELECT ai.store_id,
       SUM(f.length)::int                                AS safe_minutes,
       ROUND(SUM(f.length)/60.0, 2)                      AS safe_hours,
       ROUND(SUM(f.length)/(60.0*24), 2)                 AS safe_days
FROM available_items AS ai
JOIN film AS f ON f.film_id = ai.film_id
WHERE ai.film_id NOT IN (SELECT film_id FROM scary_films)
GROUP BY ai.store_id
ORDER BY ai.store_id;

-- End of file ✅
