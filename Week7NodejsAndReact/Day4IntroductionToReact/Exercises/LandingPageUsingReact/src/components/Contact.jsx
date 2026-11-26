import { useState } from "react";

// The demo reads uncontrolled fields with FormData; only feedback is stored in state.
export default function Contact() {
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");

  function handleInput(event) {
    setStatus("");
    const { name, value, validity } = event.target;
    if (!value.trim() || !validity.valid) return;
    setErrors(current => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = data.get("name").trim();
    const email = data.get("email").trim();
    const message = data.get("message").trim();
    const nextErrors = {};
    if (!name) nextErrors.name = "Enter a name with at least one non-space character.";
    if (!email || !form.elements.namedItem("email").validity.valid) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!message) nextErrors.message = "Enter a message with at least one non-space character.";
    setErrors(nextErrors);
    setStatus("");
    const firstInvalid = ["name", "email", "message"].find(field => nextErrors[field]);
    if (firstInvalid) {
      form.elements.namedItem(firstInvalid).focus();
      return;
    }
    // No request, delivery promise or persistence: keep the entered values available for review.
    setStatus(`Demo complete for ${name}. Nothing was sent or stored.`);
  }

  return (
    <section id="contact" className="section">
      <h2>Contact demo</h2>
      <p id="contact-demo-note" className="demo-note">
        Try the form locally. No message is sent or stored.
      </p>
      <form
        className="contact"
        onSubmit={handleSubmit}
        onInput={handleInput}
        aria-describedby="contact-demo-note"
        noValidate
      >
        <label htmlFor="contact-name">Name (required)</label>
        <input
          id="contact-name"
          name="name"
          autoComplete="name"
          required
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
        />
        {errors.name && (
          <p id="contact-name-error" className="form-error" role="alert">
            {errors.name}
          </p>
        )}
        <label htmlFor="contact-email">Email (required)</label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
        />
        {errors.email && (
          <p id="contact-email-error" className="form-error" role="alert">
            {errors.email}
          </p>
        )}
        <label htmlFor="contact-message">Message (required)</label>
        <textarea
          id="contact-message"
          name="message"
          rows="4"
          required
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
        />
        {errors.message && (
          <p id="contact-message-error" className="form-error" role="alert">
            {errors.message}
          </p>
        )}
        <button className="button" type="submit">
          Preview demo
        </button>
        {status && (
          <p className="contact-status" role="status">
            {status}
          </p>
        )}
      </form>
    </section>
  );
}
