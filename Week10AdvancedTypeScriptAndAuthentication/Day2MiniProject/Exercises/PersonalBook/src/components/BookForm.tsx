import { useState, type FormEvent } from "react";
import type { Book } from "../types";

interface BookFormProps {
  onAdd: (book: Omit<Book, "id" | "status">) => void;
}

export default function BookForm({ onAdd }: BookFormProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim() || !author.trim()) return;
    onAdd({ title: title.trim(), author: author.trim(), genre: genre.trim() || "Other" });
    setTitle("");
    setAuthor("");
    setGenre("");
  };

  return (
    <form className="row" onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={event => setTitle(event.target.value)}
        placeholder="Title"
        aria-label="Title"
      />
      <input
        value={author}
        onChange={event => setAuthor(event.target.value)}
        placeholder="Author"
        aria-label="Author"
      />
      <input
        value={genre}
        onChange={event => setGenre(event.target.value)}
        placeholder="Genre"
        aria-label="Genre"
      />
      <button type="submit">Add book</button>
    </form>
  );
}
