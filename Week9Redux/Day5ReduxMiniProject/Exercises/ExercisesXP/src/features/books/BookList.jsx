import { useState } from "react";
import { useSelector } from "react-redux";
import {
  selectBooks,
  selectHorrorBooks,
  selectFantasyBooks,
  selectScienceFictionBooks,
} from "./inventory.js";

const filters = {
  All: selectBooks,
  Horror: selectHorrorBooks,
  Fantasy: selectFantasyBooks,
  "Science fiction": selectScienceFictionBooks,
};

export default function BookList() {
  const [genre, setGenre] = useState("All");
  const books = useSelector(filters[genre]);
  return (
    <section className="card">
      <h2>Book inventory</h2>
      <label>
        Genre{" "}
        <select value={genre} onChange={event => setGenre(event.target.value)}>
          {Object.keys(filters).map(name => (
            <option key={name}>{name}</option>
          ))}
        </select>
      </label>
      <ul className="plain">
        {books.map(book => (
          <li key={book.id}>
            {book.title} — {book.author} ({book.genre})
          </li>
        ))}
      </ul>
    </section>
  );
}
