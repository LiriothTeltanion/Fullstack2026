import { useDispatch, useSelector } from "react-redux";
import { genreChanged } from "../filters/filtersSlice.js";
import { bookRemoved, selectCountByGenre, selectGenres, selectVisibleBooks } from "./booksSlice.js";

export default function BookList() {
  const books = useSelector(selectVisibleBooks);
  const genres = useSelector(selectGenres);
  const counts = useSelector(selectCountByGenre);
  const genre = useSelector(state => state.filters.genre);
  const dispatch = useDispatch();

  return (
    <section className="card">
      <h2>Inventory</h2>
      <div className="row">
        {genres.map(name => (
          <button
            key={name}
            className={name === genre ? "" : "secondary"}
            onClick={() => dispatch(genreChanged(name))}
          >
            {name} {name !== "All" && `(${counts[name]})`}
          </button>
        ))}
      </div>
      <ul className="plain">
        {books.map(book => (
          <li key={book.id}>
            <span>
              <strong>{book.title}</strong>{" "}
              <span className="muted">
                by {book.author} · {book.genre}
              </span>
            </span>
            <button className="danger" onClick={() => dispatch(bookRemoved(book.id))}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
