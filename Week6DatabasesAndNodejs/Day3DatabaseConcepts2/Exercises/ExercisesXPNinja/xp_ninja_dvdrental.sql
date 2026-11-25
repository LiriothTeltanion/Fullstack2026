-- Exercises XP Ninja: multi-table questions on the dvdrental sample database (PostgreSQL)
-- Runs only on dvdrental:  psql -d dvdrental -f xp_ninja_dvdrental.sql

-- 1. The top 5 film categories by number of rentals
SELECT c.name AS category, COUNT(r.rental_id) AS rentals
FROM category AS c
JOIN film_category AS fc ON fc.category_id = c.category_id
JOIN inventory AS i ON i.film_id = fc.film_id
JOIN rental AS r ON r.inventory_id = i.inventory_id
GROUP BY c.name
ORDER BY rentals DESC
LIMIT 5;

-- 2. Revenue per store: payment -> rental -> inventory -> store
SELECT i.store_id, SUM(p.amount) AS revenue
FROM payment AS p
JOIN rental AS r ON r.rental_id = p.rental_id
JOIN inventory AS i ON i.inventory_id = r.inventory_id
GROUP BY i.store_id
ORDER BY i.store_id;

-- 3. Customers who rented films from at least 15 different categories
SELECT cu.first_name || ' ' || cu.last_name AS customer,
       COUNT(DISTINCT fc.category_id) AS categories
FROM customer AS cu
JOIN rental AS r ON r.customer_id = cu.customer_id
JOIN inventory AS i ON i.inventory_id = r.inventory_id
JOIN film_category AS fc ON fc.film_id = i.film_id
GROUP BY cu.customer_id
HAVING COUNT(DISTINCT fc.category_id) >= 15
ORDER BY categories DESC, customer;

-- 4. Pairs of actors who appeared together in at least 6 films (a self-join on film_actor)
SELECT a1.first_name || ' ' || a1.last_name AS actor_1,
       a2.first_name || ' ' || a2.last_name AS actor_2,
       COUNT(*) AS films_together
FROM film_actor AS fa1
JOIN film_actor AS fa2
  ON fa2.film_id = fa1.film_id
 AND fa2.actor_id > fa1.actor_id  -- ">" keeps each pair once and skips an actor with himself
JOIN actor AS a1 ON a1.actor_id = fa1.actor_id
JOIN actor AS a2 ON a2.actor_id = fa2.actor_id
GROUP BY a1.actor_id, a2.actor_id
HAVING COUNT(*) >= 6
ORDER BY films_together DESC, actor_1;

-- 5. Each customer's most recent rental, with a window function
SELECT customer, title, rental_date
FROM (
  SELECT cu.first_name || ' ' || cu.last_name AS customer,
         f.title,
         r.rental_date,
         ROW_NUMBER() OVER (PARTITION BY cu.customer_id ORDER BY r.rental_date DESC) AS rn
  FROM rental AS r
  JOIN customer AS cu ON cu.customer_id = r.customer_id
  JOIN inventory AS i ON i.inventory_id = r.inventory_id
  JOIN film AS f ON f.film_id = i.film_id
) AS ranked
WHERE rn = 1
ORDER BY rental_date DESC
LIMIT 10;

-- 6. Late returns: rentals kept longer than the film's rental_duration (in days)
SELECT f.title,
       r.rental_date::date AS rented,
       r.return_date::date AS returned,
       f.rental_duration AS allowed_days,
       r.return_date::date - r.rental_date::date AS kept_days
FROM rental AS r
JOIN inventory AS i ON i.inventory_id = r.inventory_id
JOIN film AS f ON f.film_id = i.film_id
WHERE r.return_date IS NOT NULL
  AND r.return_date::date - r.rental_date::date > f.rental_duration
ORDER BY kept_days DESC, f.title
LIMIT 10;
