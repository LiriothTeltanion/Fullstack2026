-- Exercises XP Gold: sorting, aliases, DISTINCT, LIMIT/OFFSET and first joins (PostgreSQL)
-- Self-contained: builds a tiny music store, so it runs in any empty database.
--   psql -d music_store -f xp_gold_music_store.sql

DROP TABLE IF EXISTS tracks;
DROP TABLE IF EXISTS albums;
DROP TABLE IF EXISTS artists;

CREATE TABLE artists (
  artist_id SERIAL PRIMARY KEY,
  name      VARCHAR(60) NOT NULL,
  country   VARCHAR(40) NOT NULL
);

CREATE TABLE albums (
  album_id  SERIAL PRIMARY KEY,
  title     VARCHAR(80) NOT NULL,
  year      SMALLINT    NOT NULL,
  artist_id INTEGER REFERENCES artists (artist_id)
);

CREATE TABLE tracks (
  track_id SERIAL PRIMARY KEY,
  title    VARCHAR(80) NOT NULL,
  seconds  INTEGER     NOT NULL,
  album_id INTEGER REFERENCES albums (album_id)
);

INSERT INTO artists (name, country) VALUES
  ('Deafheaven', 'USA'),
  ('TesseracT', 'UK'),
  ('Bring Me The Horizon', 'UK'),
  ('Hayehudim', 'Israel'),
  ('Bilmuri', 'USA');

INSERT INTO albums (title, year, artist_id) VALUES
  ('Sunbather', 2013, 1),
  ('Infinite Granite', 2021, 1),
  ('Sonder', 2018, 2),
  ('Sempiternal', 2013, 3),
  ('That''s the Spirit', 2015, 3);

INSERT INTO tracks (title, seconds, album_id) VALUES
  ('Dream House', 554, 1),
  ('Sunbather', 616, 1),
  ('Great Mass of Color', 337, 2),
  ('Luminary', 333, 3),
  ('Juno', 297, 3),
  ('Can You Feel My Heart', 228, 4),
  ('Shadow Moses', 240, 4),
  ('Throne', 191, 5);

-- 1. Every album, newest first; albums from the same year by title
SELECT title, year
FROM albums
ORDER BY year DESC, title;

-- 2. Aliases: track length shown as minutes, with readable column names
SELECT title AS track,
       seconds / 60 AS minutes,
       seconds % 60 AS extra_seconds
FROM tracks
ORDER BY seconds DESC;

-- 3. DISTINCT: each country only once
SELECT DISTINCT country
FROM artists
ORDER BY country;

-- 4. LIMIT and OFFSET: the 3rd and 4th longest tracks
SELECT title, seconds
FROM tracks
ORDER BY seconds DESC
LIMIT 2 OFFSET 2;

-- 5. INNER JOIN with table aliases: each album next to its artist
SELECT ar.name AS artist, al.title AS album, al.year
FROM albums AS al
INNER JOIN artists AS ar ON ar.artist_id = al.artist_id
ORDER BY ar.name, al.year;

-- 6. LEFT JOIN: artists with no album in the store still appear (album is NULL)
SELECT ar.name AS artist, al.title AS album
FROM artists AS ar
LEFT JOIN albums AS al ON al.artist_id = ar.artist_id
WHERE al.album_id IS NULL
ORDER BY ar.name;

-- 7. Three tables: every track with its album and artist, only tracks over 5 minutes
SELECT ar.name AS artist, al.title AS album, t.title AS track, t.seconds
FROM tracks AS t
JOIN albums AS al ON al.album_id = t.album_id
JOIN artists AS ar ON ar.artist_id = al.artist_id
WHERE t.seconds > 300
ORDER BY t.seconds DESC;
