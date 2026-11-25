import { useState } from "react";
import BookForm from "./components/BookForm";
import List from "./components/List";
import type { Book, ReadingStatus } from "./types";

const NEXT_STATUS: Record<ReadingStatus, ReadingStatus> = {
  "to read": "reading",
  reading: "finished",
  finished: "to read",
};

const START: Book[] = [
  {
    id: 1,
    title: "The Name of the Wind",
    author: "Patrick Rothfuss",
    genre: "Fantasy",
    status: "finished",
  },
  { id: 2, title: "Sapiens", author: "Yuval Noah Harari", genre: "History", status: "reading" },
  {
    id: 3,
    title: "Clean Code",
    author: "Robert C. Martin",
    genre: "Programming",
    status: "to read",
  },
];

export default function App() {
  const [books, setBooks] = useState<Book[]>(START);

  const addBook = (data: Omit<Book, "id" | "status">) =>
    setBooks(current => [...current, { ...data, id: Date.now(), status: "to read" }]);

  const advance = (id: number) =>
    setBooks(current =>
      current.map(book => (book.id === id ? { ...book, status: NEXT_STATUS[book.status] } : book))
    );

  const remove = (id: number) => setBooks(current => current.filter(book => book.id !== id));

  const authors = [...new Set(books.map(book => book.author))].sort();

  return (
    <main>
      <h1>My books</h1>
      <section className="card">
        <BookForm onAdd={addBook} />
      </section>

      <section className="card">
        <h2>Books ({books.length})</h2>
        {/* List<Book>: T is inferred from `items` */}
        <List
          items={books}
          getKey={book => book.id}
          emptyText="No books yet."
          renderItem={book => (
            <>
              <span>
                <strong>{book.title}</strong>{" "}
                <span className="muted">
                  by {book.author} · {book.genre}
                </span>
              </span>
              <span className="row">
                <button
                  className="secondary"
                  onClick={() => advance(book.id)}
                  title="Change status"
                >
                  {book.status}
                </button>
                <button className="danger" onClick={() => remove(book.id)}>
                  Remove
                </button>
              </span>
            </>
          )}
        />
      </section>

      <section className="card">
        <h2>Authors</h2>
        {/* The same component with T = string */}
        <List
          items={authors}
          getKey={author => author}
          renderItem={author => <span>{author}</span>}
        />
      </section>
    </main>
  );
}
