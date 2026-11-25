-- Read-only follow-up to xp_gold_dvdrental.sql: visible safe films and zero totals.
-- Uses the standard dvdrental tables. A film catalog total counts each title once;
-- store totals count available physical inventory copies.

-- result: safe-films
SELECT f.film_id, f.title, f.description, f.length
FROM film AS f
WHERE NOT EXISTS (
    SELECT 1
    FROM film_category AS fc
    JOIN category AS c ON c.category_id = fc.category_id
    WHERE fc.film_id = f.film_id AND c.name ILIKE 'Horror'
)
AND COALESCE(f.title, '') !~* '(beast|monster|ghost|dead|zombie|undead)'
AND COALESCE(f.description, '') !~* '(beast|monster|ghost|dead|zombie|undead)'
ORDER BY f.title, f.film_id;

-- result: catalog-totals
WITH safe_films AS (
    SELECT f.film_id
    FROM film AS f
    WHERE NOT EXISTS (
        SELECT 1 FROM film_category AS fc
        JOIN category AS c ON c.category_id = fc.category_id
        WHERE fc.film_id = f.film_id AND c.name ILIKE 'Horror'
    )
    AND COALESCE(f.title, '') !~* '(beast|monster|ghost|dead|zombie|undead)'
    AND COALESCE(f.description, '') !~* '(beast|monster|ghost|dead|zombie|undead)'
),
totals AS (
    SELECT 'general' AS selection, COALESCE(SUM(length), 0) AS minutes FROM film
    UNION ALL
    SELECT 'safe', COALESCE(SUM(f.length), 0)
    FROM film AS f JOIN safe_films AS sf ON sf.film_id = f.film_id
)
SELECT selection, minutes, ROUND(minutes / 60.0, 2) AS hours,
       ROUND(minutes / 1440.0, 2) AS days
FROM totals ORDER BY selection;

-- result: store-totals
WITH safe_films AS (
    SELECT f.film_id
    FROM film AS f
    WHERE NOT EXISTS (
        SELECT 1 FROM film_category AS fc
        JOIN category AS c ON c.category_id = fc.category_id
        WHERE fc.film_id = f.film_id AND c.name ILIKE 'Horror'
    )
    AND COALESCE(f.title, '') !~* '(beast|monster|ghost|dead|zombie|undead)'
    AND COALESCE(f.description, '') !~* '(beast|monster|ghost|dead|zombie|undead)'
),
totals AS (
    SELECT s.store_id, COUNT(i.inventory_id) AS available_copies,
           COALESCE(SUM(f.length), 0) AS minutes,
           COALESCE(SUM(f.length) FILTER (WHERE sf.film_id IS NOT NULL), 0) AS safe_minutes
    FROM store AS s
    LEFT JOIN inventory AS i ON i.store_id = s.store_id
       AND NOT EXISTS (
           SELECT 1 FROM rental AS r
           WHERE r.inventory_id = i.inventory_id AND r.return_date IS NULL
       )
    LEFT JOIN film AS f ON f.film_id = i.film_id
    LEFT JOIN safe_films AS sf ON sf.film_id = f.film_id
    GROUP BY s.store_id
)
SELECT store_id, available_copies, minutes,
       ROUND(minutes / 60.0, 2) AS hours, ROUND(minutes / 1440.0, 2) AS days,
       safe_minutes, ROUND(safe_minutes / 60.0, 2) AS safe_hours,
       ROUND(safe_minutes / 1440.0, 2) AS safe_days
FROM totals ORDER BY store_id;
