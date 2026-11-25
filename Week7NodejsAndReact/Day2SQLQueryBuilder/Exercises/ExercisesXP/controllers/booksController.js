import * as Books from "../models/booksModel.js";

export async function listBooks(req, res, next) {
  try {
    res.json(await Books.getAllBooks());
  } catch (err) {
    next(err);
  }
}

export async function showBook(req, res, next) {
  try {
    const book = await Books.getBookById(req.params.bookId);
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.json(book);
  } catch (err) {
    next(err);
  }
}

export async function addBook(req, res, next) {
  const { title, author, published_year } = req.body;
  if (!title || !author) {
    return res.status(400).json({ error: "title and author are required" });
  }
  try {
    res.status(201).json(await Books.createBook({ title, author, published_year }));
  } catch (err) {
    next(err);
  }
}

export async function editBook(req, res, next) {
  // Only copy the fields that were sent, so a PUT can change one column.
  const changes = {};
  for (const field of ["title", "author", "published_year"]) {
    if (req.body[field] !== undefined) changes[field] = req.body[field];
  }
  if (Object.keys(changes).length === 0) {
    return res.status(400).json({ error: "Nothing to update" });
  }
  try {
    const book = await Books.updateBook(req.params.bookId, changes);
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.json(book);
  } catch (err) {
    next(err);
  }
}

export async function removeBook(req, res, next) {
  try {
    const deleted = await Books.deleteBook(req.params.bookId);
    if (!deleted) return res.status(404).json({ error: "Book not found" });
    res.json({ message: "Book deleted" });
  } catch (err) {
    next(err);
  }
}
