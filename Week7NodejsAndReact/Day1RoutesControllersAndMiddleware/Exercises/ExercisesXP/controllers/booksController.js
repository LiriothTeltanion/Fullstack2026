const books = [
  { id: 1, title: "The Hobbit", author: "J.R.R. Tolkien", year: 1937 },
  { id: 2, title: "Dune", author: "Frank Herbert", year: 1965 },
];
let nextId = 3;

function bookChanges(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Send a JSON object" };
  }
  const changes = {};
  for (const field of ["title", "author"]) {
    if (body[field] === undefined) continue;
    if (typeof body[field] !== "string" || !body[field].trim()) {
      return { error: field + " must be non-empty text" };
    }
    changes[field] = body[field].trim();
  }
  if (body.year !== undefined) {
    if (body.year === null) changes.year = null;
    else {
      // Preserve numeric form inputs, but reject coercions such as true or []
      // and reject NaN before JSON could silently serialize it as null.
      const year =
        typeof body.year === "number" ||
        (typeof body.year === "string" && /^-?\d+$/.test(body.year.trim()))
          ? Number(body.year)
          : NaN;
      if (!Number.isSafeInteger(year)) {
        return { error: "year must be a safe integer or null" };
      }
      changes.year = year;
    }
  }
  return { changes };
}

function findBook(id) {
  return books.find(book => book.id === Number(id));
}

export function getBooks(req, res) {
  res.json(books);
}

export function getBookById(req, res) {
  const book = findBook(req.params.id);
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }
  res.json(book);
}

export function addBook(req, res) {
  const result = bookChanges(req.body);
  if (result.error) return res.status(400).json({ error: result.error });
  if (result.changes.title === undefined || result.changes.author === undefined) {
    return res.status(400).json({ error: "title and author are required" });
  }
  const book = { id: nextId++, year: null, ...result.changes };
  books.push(book);
  res.status(201).json(book);
}

export function updateBook(req, res) {
  const book = findBook(req.params.id);
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }
  const result = bookChanges(req.body);
  if (result.error) return res.status(400).json({ error: result.error });
  if (!Object.keys(result.changes).length) {
    return res.status(400).json({ error: "Send a title, author or year value" });
  }
  // A bad field must reject the whole update, preserving all existing fields.
  Object.assign(book, result.changes);
  res.json(book);
}

export function deleteBook(req, res) {
  const index = books.findIndex(book => book.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: "Book not found" });
  }
  books.splice(index, 1);
  res.status(204).end();
}
