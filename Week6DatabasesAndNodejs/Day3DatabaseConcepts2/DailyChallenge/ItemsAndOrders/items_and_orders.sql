-- Daily Challenge: Items and Orders (PostgreSQL)
-- Self-contained. Uses a PL/pgSQL function, so it needs PostgreSQL (not SQLite).
--   psql -d shop -f items_and_orders.sql

DROP FUNCTION IF EXISTS order_total(INTEGER);
DROP FUNCTION IF EXISTS user_order_total(INTEGER, INTEGER);
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS product_orders;
DROP TABLE IF EXISTS users;

-- Bonus table: every order belongs to a user
CREATE TABLE users (
  user_id  SERIAL PRIMARY KEY,
  username VARCHAR(40) NOT NULL UNIQUE
);

-- One row per order
CREATE TABLE product_orders (
  order_id   SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
  ordered_at DATE    NOT NULL DEFAULT CURRENT_DATE
);

-- Many items can belong to one order (one-to-many)
CREATE TABLE items (
  item_id  SERIAL PRIMARY KEY,
  order_id INTEGER       NOT NULL REFERENCES product_orders (order_id) ON DELETE CASCADE,
  name     VARCHAR(60)   NOT NULL,
  price    NUMERIC(8, 2) NOT NULL CHECK (price >= 0),
  quantity INTEGER       NOT NULL DEFAULT 1 CHECK (quantity > 0)
);

INSERT INTO users (username) VALUES ('dana'), ('omer');

INSERT INTO product_orders (user_id, ordered_at) VALUES
  (1, '2026-11-01'),  -- order 1, dana
  (1, '2026-11-10'),  -- order 2, dana
  (2, '2026-11-12');  -- order 3, omer

INSERT INTO items (order_id, name, price, quantity) VALUES
  (1, 'Guitar strings', 35.00, 2),
  (1, 'Capo', 49.90, 1),
  (2, 'Headphones', 299.00, 1),
  (3, 'Notebook', 12.50, 4),
  (3, 'Pen', 4.00, 3);

-- 1. A function that returns the total price of one order
CREATE FUNCTION order_total(p_order_id INTEGER)
RETURNS NUMERIC
LANGUAGE plpgsql
AS $$
DECLARE
  total NUMERIC;
BEGIN
  SELECT COALESCE(SUM(price * quantity), 0)
  INTO total
  FROM items
  WHERE order_id = p_order_id;

  RETURN total;
END;
$$;

SELECT order_total(1) AS order_1;  -- 35.00*2 + 49.90 = 119.90
SELECT order_total(3) AS order_3;  -- 12.50*4 + 4.00*3 = 62.00
SELECT order_total(99) AS missing; -- no items -> 0

-- 2. Bonus: the total of an order, but only if it belongs to that user (else NULL)
CREATE FUNCTION user_order_total(p_user_id INTEGER, p_order_id INTEGER)
RETURNS NUMERIC
LANGUAGE plpgsql
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM product_orders
    WHERE order_id = p_order_id AND user_id = p_user_id
  ) THEN
    RETURN NULL;
  END IF;

  RETURN order_total(p_order_id);
END;
$$;

SELECT user_order_total(1, 2) AS dana_order_2;  -- 299.00
SELECT user_order_total(2, 2) AS omer_order_2;  -- NULL, not omer's order

-- 3. Every order with its user and total, using the function inside a query
SELECT o.order_id, u.username, o.ordered_at, order_total(o.order_id) AS total
FROM product_orders AS o
JOIN users AS u ON u.user_id = o.user_id
ORDER BY o.order_id;
