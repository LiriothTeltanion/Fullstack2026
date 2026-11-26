import { useId, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { bookAdded } from "./booksSlice.js";

const EMPTY_FORM = { title: "", author: "", genre: "" };
const FIELDS = ["title", "author", "genre"];

export default function BookForm() {
  const dispatch = useDispatch();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const fields = useRef({});
  const formId = useId();

  const handleChange = event => {
    const { name, value } = event.target;
    setForm(current => ({ ...current, [name]: value }));
    if (value.trim()) setErrors(current => ({ ...current, [name]: false }));
  };

  const handleSubmit = event => {
    event.preventDefault();
    // Validate before dispatching so an invalid attempt preserves the entire draft.
    const nextErrors = Object.fromEntries(FIELDS.map(name => [name, !form[name].trim()]));
    setErrors(nextErrors);
    const firstInvalid = FIELDS.find(name => nextErrors[name]);
    if (firstInvalid) {
      fields.current[firstInvalid]?.focus();
      return;
    }
    dispatch(
      bookAdded({ title: form.title.trim(), author: form.author.trim(), genre: form.genre.trim() })
    );
    setForm(EMPTY_FORM);
    setErrors({});
  };

  return (
    <section className="card">
      <h2>Add a book</h2>
      <form className="row" onSubmit={handleSubmit} noValidate>
        {FIELDS.map(name => {
          const label = name[0].toUpperCase() + name.slice(1);
          const id = `${formId}-${name}`;
          return (
            <div className="form-field" key={name}>
              <label htmlFor={id}>{label}</label>
              <input
                id={id}
                ref={node => {
                  fields.current[name] = node;
                }}
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={label}
                required
                dir="auto"
                aria-invalid={errors[name] || undefined}
                aria-describedby={errors[name] ? `${id}-error` : undefined}
              />
              {errors[name] && (
                <span className="error field-error" id={`${id}-error`} role="alert">
                  Enter {name === "author" ? "an" : "a"} {name} with at least one non-space
                  character.
                </span>
              )}
            </div>
          );
        })}
        <button type="submit">Add</button>
      </form>
    </section>
  );
}
