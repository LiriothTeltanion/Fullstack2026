-- Synthetic PostgreSQL demonstration. Uses its own schema and rolls back everything.
-- An existing schema with this name causes a safe failure instead of being reused.
BEGIN;
CREATE SCHEMA fullstack_waitlist_demo;
SET LOCAL search_path TO fullstack_waitlist_demo, pg_catalog;

CREATE TABLE film (
    film_id INTEGER PRIMARY KEY, title TEXT NOT NULL,
    rating TEXT NOT NULL CHECK (rating IN ('G', 'PG', 'PG-13', 'R'))
);
CREATE TABLE inventory (
    inventory_id INTEGER PRIMARY KEY, film_id INTEGER NOT NULL REFERENCES film(film_id)
);
CREATE TABLE rental (
    rental_id INTEGER PRIMARY KEY, inventory_id INTEGER NOT NULL REFERENCES inventory(inventory_id),
    return_date TIMESTAMPTZ
);
CREATE TABLE children (
    child_id INTEGER PRIMARY KEY, name TEXT NOT NULL CHECK (length(trim(name)) > 0)
);
CREATE TABLE waiting_list (
    waiting_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    inventory_id INTEGER NOT NULL REFERENCES inventory(inventory_id),
    child_id INTEGER NOT NULL REFERENCES children(child_id),
    joined_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    picked_up_at TIMESTAMPTZ CHECK (picked_up_at >= joined_at)
);
-- Historical entries remain, but a child cannot join the same active queue twice.
CREATE UNIQUE INDEX one_active_request_per_child
    ON waiting_list(inventory_id, child_id) WHERE picked_up_at IS NULL;

INSERT INTO film VALUES
    (1, 'Family Morning', 'G'), (2, 'Paper Adventure', 'PG'),
    (3, 'Adults Only', 'R'), (4, 'Teen Story', 'PG-13'), (5, 'Busy Family Film', 'G');
INSERT INTO inventory VALUES (1,1), (2,1), (3,2), (4,2), (5,3), (6,4), (7,5);
-- One family copy is out, another film has only an out copy; a returned rental is available.
INSERT INTO rental VALUES (1,2,NULL), (2,3,'2026-01-01T12:00:00Z'), (3,7,NULL);
INSERT INTO children VALUES (1, 'Practice Reader One'), (2, 'Practice Reader Two');
INSERT INTO waiting_list(inventory_id, child_id, joined_at) VALUES
    (1,1,'2026-01-01T10:00:00Z'), (1,2,'2026-01-01T10:00:00Z'),
    (3,1,'2026-01-01T10:00:00Z');

-- result: available-family-dvds
SELECT i.inventory_id AS dvd_id, f.title, f.rating
FROM inventory AS i JOIN film AS f ON f.film_id = i.film_id
WHERE f.rating IN ('G', 'PG')
AND NOT EXISTS (
    SELECT 1 FROM rental AS r
    WHERE r.inventory_id = i.inventory_id AND r.return_date IS NULL
)
ORDER BY i.inventory_id;

-- result: active-before
SELECT w.waiting_id, w.inventory_id AS dvd_id, c.name
FROM waiting_list AS w JOIN children AS c ON c.child_id = w.child_id
WHERE w.picked_up_at IS NULL
ORDER BY w.inventory_id, w.waiting_id;

-- result: counts-before
SELECT i.inventory_id AS dvd_id, COUNT(w.waiting_id) AS waiting_children
FROM inventory AS i
LEFT JOIN waiting_list AS w ON w.inventory_id = i.inventory_id AND w.picked_up_at IS NULL
GROUP BY i.inventory_id ORDER BY i.inventory_id;

-- result: pickup
-- Collection removes the name from the active list while preserving a dated history.
UPDATE waiting_list AS w SET picked_up_at = '2026-01-02T10:00:00Z'
WHERE w.inventory_id = 1 AND w.child_id = 1 AND w.picked_up_at IS NULL
AND NOT EXISTS (
    SELECT 1 FROM rental AS r
    WHERE r.inventory_id = w.inventory_id AND r.return_date IS NULL
)
RETURNING waiting_id, inventory_id AS dvd_id, child_id, picked_up_at;

-- result: active-after
SELECT w.waiting_id, w.inventory_id AS dvd_id, c.name
FROM waiting_list AS w JOIN children AS c ON c.child_id = w.child_id
WHERE w.picked_up_at IS NULL
ORDER BY w.inventory_id, w.waiting_id;

-- result: counts-after
SELECT i.inventory_id AS dvd_id, COUNT(w.waiting_id) AS waiting_children
FROM inventory AS i
LEFT JOIN waiting_list AS w ON w.inventory_id = i.inventory_id AND w.picked_up_at IS NULL
GROUP BY i.inventory_id ORDER BY i.inventory_id;

-- result: cleanup
ROLLBACK;
