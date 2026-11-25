import { useDispatch, useSelector } from "react-redux";
import { selectStats, selectVisibleMovies } from "../filters/filtersSlice.js";
import { movieRated, movieRemoved, watchedToggled } from "./moviesSlice.js";

export default function MovieList() {
  const movies = useSelector(selectVisibleMovies);
  const stats = useSelector(selectStats);
  const dispatch = useDispatch();

  return (
    <section className="card">
      <h2>
        My collection{" "}
        <span className="muted">
          ({stats.watched} of {stats.total} watched)
        </span>
      </h2>
      {movies.length === 0 && <p className="muted">No movie matches these filters.</p>}
      <ul className="plain">
        {movies.map(movie => (
          <li key={movie.id}>
            <span>
              <strong className={movie.watched ? "" : "muted"}>{movie.title}</strong> ({movie.year})
              · {movie.genre}
            </span>
            <span className="row">
              <select
                value={movie.rating}
                onChange={event =>
                  dispatch(movieRated({ id: movie.id, rating: Number(event.target.value) }))
                }
                aria-label={`Rating for ${movie.title}`}
              >
                {[1, 2, 3, 4, 5].map(stars => (
                  <option key={stars} value={stars}>
                    {"★".repeat(stars)}
                  </option>
                ))}
              </select>
              <button className="secondary" onClick={() => dispatch(watchedToggled(movie.id))}>
                {movie.watched ? "Watched ✓" : "Mark watched"}
              </button>
              <button className="danger" onClick={() => dispatch(movieRemoved(movie.id))}>
                Remove
              </button>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
