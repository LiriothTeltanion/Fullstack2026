import db from "../db/db.js";

function toPublicBook(book) {
  return book && { ...book, publishedYear: book.published_year };
}

export async function getAllBooks() {
  return (await db("books").select("*").orderBy("title")).map(toPublicBook);
}

export async function getBookById(id) {
  return toPublicBook(await db("books").where({ id }).first());
}

export async function createBook({ title, author, published_year }) {
  const [book] = await db("books").insert({ title, author, published_year }).returning("*");
  return toPublicBook(book);
}

export async function updateBook(id, changes) {
  const [book] = await db("books").where({ id }).update(changes).returning("*");
  return toPublicBook(book);
}

export function deleteBook(id) {
  return db("books").where({ id }).del();
}
