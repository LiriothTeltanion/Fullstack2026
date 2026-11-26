// Exercise 3: an API that reads the migrated and seeded tables.
import express from "express";
import rateLimit from "express-rate-limit";

// PostgreSQL integer columns accept signed 32-bit integers, including ordinary
// numeric strings from form clients. Validate them without coercing other types.
function isPgInteger(value) {
  if (typeof value === "string" && !/^[+-]?\d+$/.test(value.trim())) return false;
  if (typeof value !== "string" && typeof value !== "number") return false;
  const number = Number(value);
  return Number.isInteger(number) && number >= -2147483648 && number <= 2147483647;
}

function validateBook(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return "Send a JSON object with title and author_id.";
  }
  if (typeof body.title !== "string" || !body.title.trim()) {
    return "title must be a non-blank string.";
  }
  if (Array.from(body.title).length > 200) return "title must contain at most 200 characters.";
  if (!isPgInteger(body.author_id) || Number(body.author_id) <= 0) {
    return "author_id must be a positive integer.";
  }
  if (body.year !== undefined && body.year !== null && !isPgInteger(body.year)) {
    return "year must be an integer or null.";
  }
  return null;
}

// Construction is side-effect free so HTTP validation can be tested with an
// observed database boundary. The normal server still injects real Knex/pg.
export function createApp(db, logger = console) {
  const app = express();

  // Every IP gets at most 100 requests per 15 minutes, so one client can't flood the server.
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 100,
      standardHeaders: "draft-7",
      legacyHeaders: false,
    })
  );

  app.use(express.json());

  // Every author with how many books they have (leftJoin keeps authors with 0 books).
  app.get("/authors", async (req, res, next) => {
    try {
      const authors = await db("authors as a")
        .leftJoin("books as b", "b.author_id", "a.id")
        .select("a.id", "a.name")
        .count({ books: "b.id" })
        .groupBy("a.id", "a.name")
        .orderBy("a.id");
      res.json(authors);
    } catch (err) {
      next(err);
    }
  });

  app.get("/authors/:id/books", async (req, res, next) => {
    if (!isPgInteger(req.params.id) || Number(req.params.id) <= 0) {
      return res.status(400).json({ error: "author id must be a positive integer." });
    }
    try {
      const author = await db("authors").where({ id: req.params.id }).first();
      if (!author) return res.status(404).json({ error: "Author not found" });
      const books = await db("books")
        .select("id", "title", "year")
        .where({ author_id: author.id })
        .orderBy("year");
      res.json({ author: author.name, books });
    } catch (err) {
      next(err);
    }
  });

  app.post("/books", async (req, res, next) => {
    const error = validateBook(req.body);
    if (error) return res.status(400).json({ error });
    const { title, year, author_id } = req.body;
    try {
      const [book] = await db("books").insert({ title, year, author_id }).returning("*");
      res.status(201).json(book);
    } catch (err) {
      // This specific FK means the requested author no longer exists, including
      // deletion racing the insert. Other integrity/database failures stay 500.
      if (err.code === "23503" && err.constraint === "books_author_id_foreign") {
        return res.status(404).json({ error: "Author not found" });
      }
      next(err);
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err, req, res, next) => {
    if (err.type === "entity.parse.failed") {
      return res.status(400).json({ error: "Send a valid JSON object." });
    }
    logger.error(err.message);
    res.status(500).json({ error: "Database error" });
  });

  return app;
}
