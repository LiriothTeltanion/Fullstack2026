import { useState } from "react";
import { useDispatch } from "react-redux";
import { bookAdded } from "./booksSlice.js";

const EMPTY_FORM = { title: "", author: "", genre: "" };

export default function BookForm() {
  const dispatch = useDispatch();
  const [form, setForm] = useState(EMPTY_FORM);

  const handleChange = event => setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = event => {
    event.preventDefault();
    if (!form.title.trim() || !form.author.trim() || !form.genre.trim()) return;
    dispatch(
      bookAdded({ title: form.title.trim(), author: form.author.trim(), genre: form.genre.trim() })
    );
    setForm(EMPTY_FORM);
  };

  return (
    <section className="card">
      <h2>Add a book</h2>
      <form className="row" onSubmit={handleSubmit}>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          aria-label="Title"
        />
        <input
          name="author"
          value={form.author}
          onChange={handleChange}
          placeholder="Author"
          aria-label="Author"
        />
        <input
          name="genre"
          value={form.genre}
          onChange={handleChange}
          placeholder="Genre"
          aria-label="Genre"
        />
        <button type="submit">Add</button>
      </form>
    </section>
  );
}
