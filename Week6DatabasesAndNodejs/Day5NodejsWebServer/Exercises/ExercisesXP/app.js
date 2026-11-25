import express from "express";
import { fetchPosts } from "./data/dataService.js";

// The three exercises share one local listener. Their data stays in memory.
// The injected fetcher keeps the external-service route deterministic in tests.
export function createApp({ fetchPostsImpl = fetchPosts } = {}) {
  const app = express();
  const posts = [];
  const books = [];
  let nextPostId = 1;
  let nextBookId = 1;
  app.use(express.json());

  app.get("/posts", (req, res) => res.json(posts));
  app.get("/posts/:id", (req, res) => {
    const post = posts.find(item => item.id === Number(req.params.id));
    if (!post) return res.status(404).json({ error: "Post not found" });
    return res.json(post);
  });
  app.post("/posts", (req, res) => {
    const { title, content } = req.body ?? {};
    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof content !== "string" ||
      !content.trim()
    ) {
      return res.status(400).json({ error: "title and content are required" });
    }
    const post = { id: nextPostId++, title: title.trim(), content: content.trim() };
    posts.push(post);
    return res.status(201).json(post);
  });
  app.put("/posts/:id", (req, res) => {
    const post = posts.find(item => item.id === Number(req.params.id));
    if (!post) return res.status(404).json({ error: "Post not found" });
    const { title, content } = req.body ?? {};
    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof content !== "string" ||
      !content.trim()
    ) {
      return res.status(400).json({ error: "title and content are required" });
    }
    Object.assign(post, { title: title.trim(), content: content.trim() });
    return res.json(post);
  });
  app.delete("/posts/:id", (req, res) => {
    const index = posts.findIndex(item => item.id === Number(req.params.id));
    if (index === -1) return res.status(404).json({ error: "Post not found" });
    posts.splice(index, 1);
    return res.status(204).end();
  });

  app.get("/api/books", (req, res) => res.json(books));
  app.get("/api/books/:bookId", (req, res) => {
    const book = books.find(item => item.id === Number(req.params.bookId));
    if (!book) return res.status(404).json({ error: "Book not found" });
    return res.json(book);
  });
  app.post("/api/books", (req, res) => {
    const { title, author, publishedYear } = req.body ?? {};
    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof author !== "string" ||
      !author.trim()
    ) {
      return res.status(400).json({ error: "title and author are required" });
    }
    if (publishedYear !== undefined && !Number.isInteger(publishedYear)) {
      return res.status(400).json({ error: "publishedYear must be an integer" });
    }
    const book = { id: nextBookId++, title: title.trim(), author: author.trim() };
    if (publishedYear !== undefined) book.publishedYear = publishedYear;
    books.push(book);
    return res.status(201).json(book);
  });

  app.get("/external-posts", async (req, res, next) => {
    try {
      res.json(await fetchPostsImpl());
    } catch (error) {
      next(error);
    }
  });
  app.use((req, res) => res.status(404).json({ error: "Route not found" }));
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err, req, res, next) => {
    if (err.type === "entity.parse.failed") {
      return res.status(400).json({ error: "Invalid JSON body" });
    }
    return res.status(502).json({ error: "The external posts service is unavailable" });
  });
  return app;
}
