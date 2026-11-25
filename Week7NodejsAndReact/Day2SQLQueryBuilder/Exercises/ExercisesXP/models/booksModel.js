import db from "../db/db.js";

export function getAllBooks() {
  return db("books").select("*").orderBy("title");
}

export function getBookById(id) {
  return db("books").where({ id }).first();
}

export async function createBook({ title, author, published_year }) {
  const [book] = await db("books").insert({ title, author, published_year }).returning("*");
  return book;
}

export async function updateBook(id, changes) {
  const [book] = await db("books").where({ id }).update(changes).returning("*");
  return book;
}

export function deleteBook(id) {
  return db("books").where({ id }).del();
}
