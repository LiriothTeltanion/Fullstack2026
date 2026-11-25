-- =============================================================
-- 🗃️  Exercises XP — SQL Answers (PostgreSQL)
-- Target DBs:
--   A) public schema with tables: items, customers
--   B) dvdrental sample database
-- Notes:
-- - Adjust identifiers if your table/column names differ.
-- - Queries are separated by section markers.
-- =============================================================

/* -------------------------------------------------------------
   A) Items & Customers (public schema from previous day)
------------------------------------------------------------- */

-- A.1 All items, ordered by price (lowest to highest)
SELECT *
FROM items
ORDER BY price ASC;

-- A.2 Items with a price >= 80, ordered by price (highest to lowest)
SELECT *
FROM items
WHERE price >= 80
ORDER BY price DESC;

-- A.3 First 3 customers in alphabetical order of first name (A–Z),
--     exclude the primary key column from the results.
--     (Day 1 columns: id, first_name, last_name)
SELECT first_name, last_name
FROM customers
ORDER BY first_name ASC
LIMIT 3;

-- A.4 All last names (only that column), reverse alphabetical order (Z–A)
SELECT last_name
FROM customers
ORDER BY last_name DESC;


/* -------------------------------------------------------------
   B) dvdrental database
------------------------------------------------------------- */

-- B.1 Select all columns from the customer table
SELECT *
FROM customer;

-- B.2 Display names using alias "full_name"
SELECT (first_name || ' ' || last_name) AS full_name
FROM customer;

-- B.3 Get all unique create_date values (no duplicates)
SELECT DISTINCT create_date
FROM customer
ORDER BY create_date;

-- B.4 All customer details ordered by first_name descending
SELECT *
FROM customer
ORDER BY first_name DESC;

-- B.5 Film id, title, description, release_year, rental_rate ordered by rental_rate ascending
SELECT film_id, title, description, release_year, rental_rate
FROM film
ORDER BY rental_rate ASC, title ASC;

-- B.6 Address and phone for customers living in the Texas district
--     Join customer -> address and filter district = 'Texas'
SELECT a.address, a.phone
FROM customer AS c
JOIN address  AS a ON a.address_id = c.address_id
WHERE a.district = 'Texas';

-- B.7 All movie details where the film_id is either 15 or 150
SELECT *
FROM film
WHERE film_id IN (15, 150);

-- B.8 Check if your favorite movie exists (edit the title inside the ILIKE)
--     Return id, title, description, length, rental_rate
SELECT film_id, title, description, length, rental_rate
FROM film
WHERE title ILIKE 'Your Favorite Movie Title Here';

-- B.9 If unsure about spelling, match by first two letters (edit prefix)
SELECT film_id, title, description, length, rental_rate
FROM film
WHERE title ILIKE 'AB%'
ORDER BY title;

-- B.10 Find the 10 cheapest movies
SELECT film_id, title, rental_rate
FROM film
ORDER BY rental_rate ASC, title ASC
LIMIT 10;

-- B.11 Next 10 cheapest movies (rows 11–20) — window function, no LIMIT in outer query
SELECT film_id, title, rental_rate
FROM (
  SELECT film_id, title, rental_rate,
         ROW_NUMBER() OVER (ORDER BY rental_rate ASC, title ASC) AS rn
  FROM film
) AS ranked
WHERE rn BETWEEN 11 AND 20
ORDER BY rn;

-- B.12 Join customer and payment:
--     first_name, last_name, amount, payment_date – ordered by customer_id then date
SELECT c.customer_id, c.first_name, c.last_name, p.amount, p.payment_date
FROM customer AS c
JOIN payment  AS p ON p.customer_id = c.customer_id
ORDER BY c.customer_id ASC, p.payment_date ASC;

-- B.13 Movies not in inventory
SELECT f.*
FROM film AS f
WHERE NOT EXISTS (
  SELECT 1
  FROM inventory AS i
  WHERE i.film_id = f.film_id
);

-- B.14 Which city is in which country
SELECT ci.city_id, ci.city, co.country_id, co.country
FROM city    AS ci
JOIN country AS co ON co.country_id = ci.country_id
ORDER BY co.country, ci.city;

-- B.15 Bonus — sales by staff: customer id, names, amount, payment date,
--             ordered by staff_id who sold the DVD
SELECT s.staff_id,
       c.customer_id, c.first_name, c.last_name,
       p.amount, p.payment_date
FROM payment AS p
JOIN customer AS c ON c.customer_id = p.customer_id
JOIN staff    AS s ON s.staff_id    = p.staff_id
ORDER BY s.staff_id, c.customer_id, p.payment_date;

-- End of file ✅
