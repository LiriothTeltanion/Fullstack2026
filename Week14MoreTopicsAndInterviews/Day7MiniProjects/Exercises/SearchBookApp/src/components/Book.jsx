import { useState } from "react";
import { filterAndSortBooks } from "../books.js";
import BookList from "./BookList.jsx";

const API_URL = "https://www.googleapis.com/books/v1/volumes";
// Optional: without a key every app shares one small daily quota and Google
// can answer 429. Put VITE_GOOGLE_BOOKS_KEY in .env.local (ignored by Git)
const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_KEY?.trim() ?? "";

export default function Book() {
  const [query, setQuery] = useState("");
  const [filterText, setFilterText] = useState("");
  const [books, setBooks] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  async function searchBooks(event) {
    event.preventDefault();
    const term = query.trim();
    if (!term) {
      setError("Type a title, an author or a topic first.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setError("");
    try {
      const url = new URL(API_URL);
      url.searchParams.set("q", term);
      url.searchParams.set("maxResults", "40");
      url.searchParams.set("printType", "books");
      if (API_KEY) url.searchParams.set("key", API_KEY);

      const response = await fetch(url);
      if (response.status === 429) {
        throw new Error("Google Books daily limit reached. Add a key in .env.local or try later.");
      }
      if (!response.ok) {
        throw new Error(`Google Books answered ${response.status}`);
      }
      const data = await response.json();
      // "items" is missing altogether when nothing matches
      setBooks(data.items ?? []);
      setFilterText("");
      setStatus("done");
    } catch (err) {
      setBooks([]);
      setError(`Could not load books: ${err.message}`);
      setStatus("error");
    }
  }

  const visibleBooks = filterAndSortBooks(books, filterText);

  return (
    <section className="book">
      <form className="search-box" onSubmit={searchBooks}>
        <label htmlFor="query">Search Google Books</label>
        <input
          id="query"
          type="search"
          value={query}
          onChange={event => setQuery(event.target.value)}
          placeholder="Harry Potter, Tolkien, JavaScript…"
        />
        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Searching…" : "Search"}
        </button>
      </form>

      {books.length > 0 && (
        <div className="filter-box">
          <label htmlFor="filter">Filter these results by title or author</label>
          <input
            id="filter"
            type="text"
            value={filterText}
            onChange={event => setFilterText(event.target.value)}
            placeholder="Filter…"
          />
        </div>
      )}

      <p className="status" role="status" aria-live="polite">
        {status === "loading" && "Loading books…"}
        {status === "error" && error}
        {status === "done" &&
          (books.length === 0
            ? "No books found. Try another search."
            : `${visibleBooks.length} of ${books.length} books, newest first`)}
      </p>

      <BookList books={visibleBooks} />
    </section>
  );
}
