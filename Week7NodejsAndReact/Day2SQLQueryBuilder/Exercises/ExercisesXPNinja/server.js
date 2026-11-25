// Exercise 3: an API that reads the migrated and seeded tables.
import "dotenv/config";
import express from "express";
import db from "./db/db.js";

const app = express();
const PORT = process.env.PORT || 3000;

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
  const { title, year, author_id } = req.body;
  if (!title || !author_id) {
    return res.status(400).json({ error: "title and author_id are required" });
  }
  try {
    const [book] = await db("books").insert({ title, year, author_id }).returning("*");
    res.status(201).json(book);
  } catch (err) {
    next(err);
  }
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: "Database error" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
