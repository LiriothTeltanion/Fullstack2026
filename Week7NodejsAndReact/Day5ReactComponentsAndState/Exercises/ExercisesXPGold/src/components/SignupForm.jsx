import { useState } from "react";

const empty = { name: "", email: "", language: "JavaScript", newsletter: false };

// Exercise 2: every input reads from state and writes back on change.
export default function SignupForm() {
  const [form, setForm] = useState(empty);
  const [sent, setSent] = useState(null);

  // One handler for all fields: the input's name says which key to update.
  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setForm(current => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSent(form);
    setForm(empty);
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          Name <input name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          Email{" "}
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Favorite language{" "}
          <select name="language" value={form.language} onChange={handleChange}>
            <option>JavaScript</option>
            <option>Python</option>
            <option>TypeScript</option>
          </select>
        </label>
        <label>
          <input
            name="newsletter"
            type="checkbox"
            checked={form.newsletter}
            onChange={handleChange}
          />{" "}
          Send me the newsletter
        </label>
        <button type="submit">Sign up</button>
      </form>

      <p className="preview">
        Live preview: {form.name || "(no name)"} · {form.email || "(no email)"} · {form.language}
        {form.newsletter ? " · newsletter" : ""}
      </p>
      {sent && (
        <p>
          Thanks {sent.name}, you are signed up with {sent.email}.
        </p>
      )}
    </>
  );
}
