-- Independent, synthetic PostgreSQL transaction; no real customer or purchase is touched.
BEGIN;
CREATE SCHEMA fullstack_customer_join_demo;
SET LOCAL search_path TO fullstack_customer_join_demo, pg_catalog;

CREATE TABLE customers (
    customer_id INTEGER PRIMARY KEY, first_name TEXT NOT NULL, last_name TEXT NOT NULL
);
CREATE TABLE purchases (
    purchase_id INTEGER PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(customer_id) ON DELETE SET NULL,
    item TEXT NOT NULL
);
INSERT INTO customers VALUES
    (1,'Scott','Scott'), (2,'Harry','Potter'), (3,'John','Doe'),
    (4,'Yara','Young'), (5,'Zoe','Zed');
INSERT INTO purchases VALUES
    (1,1,'Practice notebook'), (2,2,'Practice pencil'), (3,NULL,'Unassigned practice order');

-- result: last-two-names
-- Descending names select the last two alphabetically without exposing the ID.
SELECT first_name, last_name FROM customers
ORDER BY first_name DESC, last_name DESC LIMIT 2;

-- result: deleted-scott-purchases
DELETE FROM purchases AS p USING customers AS c
WHERE p.customer_id = c.customer_id AND c.first_name = 'Scott'
RETURNING p.purchase_id, p.item;

-- result: scott-still-exists
SELECT first_name, last_name FROM customers WHERE first_name = 'Scott';

-- result: purchases-left-join
-- A NULL customer foreign key survives a LEFT JOIN from purchases.
SELECT p.purchase_id, p.item, c.first_name, c.last_name
FROM purchases AS p LEFT JOIN customers AS c ON c.customer_id = p.customer_id
ORDER BY p.purchase_id;

-- result: purchases-inner-join
-- INNER JOIN excludes the unassigned purchase, but does not restore the deleted one.
SELECT p.purchase_id, p.item, c.first_name, c.last_name
FROM purchases AS p INNER JOIN customers AS c ON c.customer_id = p.customer_id
ORDER BY p.purchase_id;

-- result: customer-left-join
-- Scott still appears from the customer side, with NULL purchase columns.
SELECT c.first_name, c.last_name, p.purchase_id, p.item
FROM customers AS c LEFT JOIN purchases AS p ON p.customer_id = c.customer_id
WHERE c.first_name = 'Scott';

-- result: cleanup
ROLLBACK;
