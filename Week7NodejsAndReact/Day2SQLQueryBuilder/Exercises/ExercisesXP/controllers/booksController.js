import * as Books from "../models/booksModel.js";

function bookChanges(body = {}) {
  const changes = {};
  for (const [field, maxLength] of [
    ["title", 200],
    ["author", 120],
  ]) {
    if (body[field] === undefined) continue;
    if (
      typeof body[field] !== "string" ||
      !body[field].trim() ||
      body[field].trim().length > maxLength
    ) {
      return { error: field + " must be non-empty text of at most " + maxLength + " characters" };
    }
    changes[field] = body[field].trim();
  }
  const year = body.publishedYear !== undefined ? body.publishedYear : body.published_year;
  if (
    body.publishedYear !== undefined &&
    body.published_year !== undefined &&
    body.publishedYear !== body.published_year
  ) {
    return { error: "Send one consistent publishedYear value" };
  }
  if (year !== undefined) {
    if (year === null) changes.published_year = null;
    else {
      const numeric = typeof year === "number" || typeof year === "string" ? Number(year) : NaN;
      if (
        String(year).trim() === "" ||
        !Number.isInteger(numeric) ||
        numeric < -2147483648 ||
        numeric > 2147483647
      ) {
        return { error: "publishedYear must be an integer or null" };
      }
      changes.published_year = numeric;
    }
  }
  return { changes };
}

export async function listBooks(req, res, next) {
  try {
    res.json(await Books.getAllBooks());
  } catch (error) {
    next(error);
  }
}
export async function showBook(req, res, next) {
  try {
    const book = await Books.getBookById(req.params.bookId);
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.json(book);
  } catch (error) {
    next(error);
  }
}
export async function addBook(req, res, next) {
  const result = bookChanges(req.body ?? {});
  if (result.error) return res.status(400).json({ error: result.error });
  if (!result.changes.title || !result.changes.author)
    return res.status(400).json({ error: "title and author are required" });
  try {
    res.status(201).json(await Books.createBook(result.changes));
  } catch (error) {
    next(error);
  }
}
export async function editBook(req, res, next) {
  const result = bookChanges(req.body ?? {});
  if (result.error) return res.status(400).json({ error: result.error });
  if (!Object.keys(result.changes).length)
    return res.status(400).json({ error: "Nothing to update" });
  try {
    const book = await Books.updateBook(req.params.bookId, result.changes);
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.json(book);
  } catch (error) {
    next(error);
  }
}
export async function removeBook(req, res, next) {
  try {
    if (!(await Books.deleteBook(req.params.bookId)))
      return res.status(404).json({ error: "Book not found" });
    res.json({ message: "Book deleted" });
  } catch (error) {
    next(error);
  }
}
