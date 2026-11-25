import { useState } from "react";
import { useDispatch } from "react-redux";
import { GENRES, movieAdded } from "./moviesSlice.js";

const THIS_YEAR = new Date().getFullYear();
const EMPTY = { title: "", year: String(THIS_YEAR), genre: GENRES[0], rating: "3" };

export default function MovieForm() {
  const dispatch = useDispatch();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");

  const handleChange = event => setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = event => {
    event.preventDefault();
    const year = Number(form.year);
    if (!form.title.trim()) return setError("The title is required.");
    if (!Number.isInteger(year) || year < 1888 || year > THIS_YEAR + 5)
      return setError("That year doesn't look right.");
    dispatch(
      movieAdded({ title: form.title.trim(), year, genre: form.genre, rating: Number(form.rating) })
    );
    setForm(EMPTY);
    setError("");
  };

  return (
    <section className="card">
      <h2>Add a movie</h2>
      <form className="row" onSubmit={handleSubmit}>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          aria-label="Title"
        />
        <input
          name="year"
          type="number"
          value={form.year}
          onChange={handleChange}
          aria-label="Year"
          style={{ width: "6rem" }}
        />
        <select name="genre" value={form.genre} onChange={handleChange} aria-label="Genre">
          {GENRES.map(genre => (
            <option key={genre}>{genre}</option>
          ))}
        </select>
        <select name="rating" value={form.rating} onChange={handleChange} aria-label="Rating">
          {[1, 2, 3, 4, 5].map(stars => (
            <option key={stars} value={stars}>
              {"★".repeat(stars)}
            </option>
          ))}
        </select>
        <button type="submit">Add</button>
      </form>
      {error && <p className="error">{error}</p>}
    </section>
  );
}
