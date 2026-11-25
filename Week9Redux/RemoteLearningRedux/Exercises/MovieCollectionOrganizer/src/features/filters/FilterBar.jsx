import { useDispatch, useSelector } from "react-redux";
import { GENRES } from "../movies/moviesSlice.js";
import { filtersReset, genreFiltered, sortChanged, statusFiltered } from "./filtersSlice.js";

export default function FilterBar() {
  const { genre, status, sortBy } = useSelector(state => state.filters);
  const dispatch = useDispatch();

  return (
    <section className="card row">
      <select
        value={genre}
        onChange={event => dispatch(genreFiltered(event.target.value))}
        aria-label="Genre"
      >
        <option>All</option>
        {GENRES.map(name => (
          <option key={name}>{name}</option>
        ))}
      </select>
      <select
        value={status}
        onChange={event => dispatch(statusFiltered(event.target.value))}
        aria-label="Watched status"
      >
        <option value="all">Watched and unwatched</option>
        <option value="watched">Watched</option>
        <option value="unwatched">Still to watch</option>
      </select>
      <select
        value={sortBy}
        onChange={event => dispatch(sortChanged(event.target.value))}
        aria-label="Sort by"
      >
        <option value="title">Sort by title</option>
        <option value="year">Sort by year</option>
        <option value="rating">Sort by rating</option>
      </select>
      <button className="secondary" onClick={() => dispatch(filtersReset())}>
        Reset
      </button>
    </section>
  );
}
