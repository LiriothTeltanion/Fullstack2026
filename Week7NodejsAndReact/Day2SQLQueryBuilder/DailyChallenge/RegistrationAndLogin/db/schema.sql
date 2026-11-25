-- Two tables: the public user data and the password hash, kept apart.
DROP TABLE IF EXISTS hashpwd;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(50) NOT NULL UNIQUE,
  first_name VARCHAR(50),
  last_name VARCHAR(50)
);

CREATE TABLE hashpwd (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE REFERENCES users (username) ON UPDATE CASCADE ON DELETE CASCADE,
  password VARCHAR(255) NOT NULL
);
