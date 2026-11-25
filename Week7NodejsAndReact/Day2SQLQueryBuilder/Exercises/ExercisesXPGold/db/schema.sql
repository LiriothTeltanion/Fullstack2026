-- A tiny store to practise Knex queries on.
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS products;

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  price NUMERIC(8, 2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers (id),
  product_id INTEGER NOT NULL REFERENCES products (id),
  quantity INTEGER NOT NULL CHECK (quantity > 0)
);

INSERT INTO products (name, category, price, stock) VALUES
  ('Mechanical keyboard', 'tech', 320.00, 5),
  ('USB-C cable', 'tech', 25.90, 40),
  ('Green tea', 'kitchen', 18.50, 30),
  ('Coffee beans', 'kitchen', 54.00, 12),
  ('Desk lamp', 'home', 89.90, 7);

INSERT INTO customers (name, city) VALUES
  ('Noa', 'Tel Aviv'),
  ('Ariel', 'Haifa'),
  ('Maya', 'Beersheba');

INSERT INTO orders (customer_id, product_id, quantity) VALUES
  (1, 1, 1),
  (1, 3, 2),
  (2, 2, 3),
  (3, 4, 1),
  (3, 3, 1);
