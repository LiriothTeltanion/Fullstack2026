import { useState } from "react";

const empty = { name: "", email: "", language: "JavaScript", newsletter: false };

// Exercise 2: every input reads from state and writes back on change.
export default function SignupForm() {
  const [form, setForm] = useState(empty);
  const [sent, setSent] = useState(null);

  // One handler for all fields: the input's name says which key to update.
  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    if (name === "name") event.target.setCustomValidity("");
    setForm(current => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const name = form.name.trim();
    if (!name) {
      const field = event.currentTarget.elements.namedItem("name");
      field.setCustomValidity("Enter a name with at least one non-space character.");
      field.reportValidity();
      return;
    }
    setSent({ ...form, name });
    setForm(empty);
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          Name <input name="name" dir="auto" value={form.name} onChange={handleChange} required />
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
          Include the newsletter in my preview
        </label>
        <button type="submit">Preview signup</button>
      </form>

      <p className="preview">
        Live preview: {form.name || "(no name)"} · {form.email || "(no email)"} · {form.language}
        {form.newsletter ? " · newsletter" : ""}
      </p>
      <p role="status">
        {sent && (
          <>
            Signup preview for <bdi>{sent.name}</bdi> · <bdi>{sent.email}</bdi> · {sent.language}
            {sent.newsletter ? " · newsletter included" : " · no newsletter"}.
          </>
        )}
      </p>
    </>
  );
}
