import { useId, useRef, useState, type FormEvent } from "react";
import type { Book } from "../types";

interface BookFormProps {
  onAdd: (book: Omit<Book, "id" | "status">) => void;
}

export default function BookForm({ onAdd }: BookFormProps) {
  const formId = useId();
  const titleInput = useRef<HTMLInputElement>(null);
  const authorInput = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [errors, setErrors] = useState({ title: false, author: false });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Validate trimmed values ourselves so whitespace receives the same helpful feedback as an empty field.
    const nextErrors = { title: !title.trim(), author: !author.trim() };
    setErrors(nextErrors);
    if (nextErrors.title || nextErrors.author) {
      (nextErrors.title ? titleInput : authorInput).current?.focus();
      return;
    }
    onAdd({ title: title.trim(), author: author.trim(), genre: genre.trim() || "Other" });
    setTitle("");
    setAuthor("");
    setGenre("");
  };

  return (
    <form className="row book-form" onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label htmlFor={`${formId}-title`}>Title (required)</label>
        <input
          id={`${formId}-title`}
          ref={titleInput}
          required
          value={title}
          onChange={event => {
            const value = event.target.value;
            setTitle(value);
            if (value.trim()) setErrors(current => ({ ...current, title: false }));
          }}
          placeholder="Title"
          aria-invalid={errors.title || undefined}
          aria-describedby={errors.title ? `${formId}-title-error` : undefined}
        />
        {errors.title && (
          <span className="error field-error" id={`${formId}-title-error`} role="alert">
            Enter a title with at least one non-space character.
          </span>
        )}
      </div>
      <div className="form-field">
        <label htmlFor={`${formId}-author`}>Author (required)</label>
        <input
          id={`${formId}-author`}
          ref={authorInput}
          required
          value={author}
          onChange={event => {
            const value = event.target.value;
            setAuthor(value);
            if (value.trim()) setErrors(current => ({ ...current, author: false }));
          }}
          placeholder="Author"
          aria-invalid={errors.author || undefined}
          aria-describedby={errors.author ? `${formId}-author-error` : undefined}
        />
        {errors.author && (
          <span className="error field-error" id={`${formId}-author-error`} role="alert">
            Enter an author with at least one non-space character.
          </span>
        )}
      </div>
      <div className="form-field">
        <label htmlFor={`${formId}-genre`}>Genre (optional)</label>
        <input
          id={`${formId}-genre`}
          value={genre}
          onChange={event => setGenre(event.target.value)}
          placeholder="Genre"
        />
      </div>
      <button type="submit">Add book</button>
    </form>
  );
}
