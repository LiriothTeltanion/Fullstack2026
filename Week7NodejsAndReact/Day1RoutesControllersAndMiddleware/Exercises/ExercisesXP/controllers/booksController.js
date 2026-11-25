const books = [
  { id: 1, title: "The Hobbit", author: "J.R.R. Tolkien", year: 1937 },
  { id: 2, title: "Dune", author: "Frank Herbert", year: 1965 },
];
let nextId = 3;

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
  const { title, author, year } = req.body;
  if (!title || !author) {
    return res.status(400).json({ error: "title and author are required" });
  }
  const book = { id: nextId++, title, author, year: Number(year) || null };
  books.push(book);
  res.status(201).json(book);
}

export function updateBook(req, res) {
  const book = findBook(req.params.id);
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }
  const { title, author, year } = req.body;
  if (title !== undefined) book.title = title;
  if (author !== undefined) book.author = author;
  if (year !== undefined) book.year = Number(year);
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
