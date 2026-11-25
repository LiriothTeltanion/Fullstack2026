import type { Book } from "./types";

export const initialBooks: Book[] = [
  { id: 1, title: "Notes from the Garden", author: "Mira Levi" },
  { id: 2, title: "A Small Atlas of Sounds", author: "Noam Hale" },
  { id: 3, title: "The Long Way Home", author: "Luca Reed" },
];

export function appendBook(books: Book[], title: string, author: string): Book[] {
  const cleanTitle = title.trim();
  const cleanAuthor = author.trim();
  if (!cleanTitle || !cleanAuthor) {
    throw new Error("Enter both a title and an author.");
  }
  // Compute from the latest collection, so rapid additions cannot share an ID.
  const id = Math.max(0, ...books.map(book => book.id)) + 1;
  return [...books, { id, title: cleanTitle, author: cleanAuthor }];
}
