import { useState } from "react";
import type { FormEvent } from "react";
import type { Book } from "./types";
import { appendBook, initialBooks } from "./books";
import { List } from "./components/List";

export default function BookApp() {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || !author.trim()) {
      setError("Enter both a title and an author.");
      return;
    }
    setBooks(current => appendBook(current, title, author));
    setTitle("");
    setAuthor("");
    setError("");
  }

  return (
    <main>
      <header>
        <p className="eyebrow">TypeScript and React</p>
        <h1>A shelf of stories.</h1>
        <p>Add a book to this small reading list.</p>
      </header>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Book title</label>
        <input id="title" value={title} onChange={event => setTitle(event.target.value)} required />
        <label htmlFor="author">Author</label>
        <input
          id="author"
          value={author}
          onChange={event => setAuthor(event.target.value)}
          required
        />
        <button type="submit">Add book</button>
        {error && <p role="alert">{error}</p>}
      </form>
      <section aria-labelledby="books-title">
        <h2 id="books-title">My book list</h2>
        <p role="status">{books.length} books on the shelf</p>
        <List<Book>
          items={books}
          renderItem={book => (
            <article>
              <h3>{book.title}</h3>
              <p>{book.author}</p>
              <small>Book {book.id}</small>
            </article>
          )}
        />
      </section>
    </main>
  );
}
