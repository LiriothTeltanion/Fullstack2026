-- Exercises XP Ninja: harder questions on the dvdrental sample database (PostgreSQL)
-- Runs only on dvdrental:  psql -d dvdrental -f xp_ninja_dvdrental.sql

-- 1. The 5 longest films, with the length shown as hours and minutes
SELECT title,
       length,
       length / 60 || 'h ' || length % 60 || 'm' AS duration
FROM film
ORDER BY length DESC, title
LIMIT 5;

-- 2. Every rating once, and how many films each one has
SELECT rating, COUNT(*) AS films
FROM film
GROUP BY rating
ORDER BY films DESC;

-- 3. Customers whose first and last name start with the same letter
SELECT first_name, last_name
FROM customer
WHERE LEFT(first_name, 1) = LEFT(last_name, 1)
ORDER BY last_name, first_name;

-- 4. Films that cost more to replace than the average replacement cost (a subquery)
SELECT title, replacement_cost
FROM film
WHERE replacement_cost > (SELECT AVG(replacement_cost) FROM film)
ORDER BY replacement_cost DESC, title
LIMIT 10;

-- 5. The 5 customers who paid the most in total (join + GROUP BY + SUM)
SELECT c.customer_id,
       c.first_name || ' ' || c.last_name AS customer,
       SUM(p.amount) AS total_paid,
       COUNT(*) AS payments
FROM customer AS c
JOIN payment AS p ON p.customer_id = c.customer_id
GROUP BY c.customer_id
ORDER BY total_paid DESC
LIMIT 5;

-- 6. Actors who played in more than 35 films (HAVING filters after grouping)
SELECT a.first_name, a.last_name, COUNT(fa.film_id) AS films
FROM actor AS a
JOIN film_actor AS fa ON fa.actor_id = a.actor_id
GROUP BY a.actor_id, a.first_name, a.last_name
HAVING COUNT(fa.film_id) > 35
ORDER BY films DESC;

-- 7. Films that were never rented, including films with no copy in inventory (LEFT JOIN + IS NULL)
SELECT DISTINCT f.title
FROM film AS f
LEFT JOIN inventory AS i ON i.film_id = f.film_id
LEFT JOIN rental AS r ON r.inventory_id = i.inventory_id
WHERE r.rental_id IS NULL
ORDER BY f.title;
