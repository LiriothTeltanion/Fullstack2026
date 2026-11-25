import { useState } from "react";

export default function MessageForm({ onAdd }) {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSending(true);
    setError("");
    try {
      await onAdd({ name, text });
      setText("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <label>
        Name
        <input value={name} onChange={e => setName(e.target.value)} maxLength={40} required />
      </label>
      <label>
        Message <span className="muted">({280 - text.length} left)</span>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          maxLength={280}
          rows={3}
          required
        />
      </label>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" disabled={sending}>
        {sending ? "Saving…" : "Sign the guestbook"}
      </button>
    </form>
  );
}
