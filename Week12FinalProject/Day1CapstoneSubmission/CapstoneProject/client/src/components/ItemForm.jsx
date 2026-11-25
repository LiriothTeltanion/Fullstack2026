import { useState } from "react";

function ItemForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async event => {
    event.preventDefault();
    if (!title.trim()) return;
    try {
      await onAdd(title.trim());
      setTitle("");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="card row" onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={event => setTitle(event.target.value)}
        placeholder="New item"
        aria-label="New item"
      />
      <button type="submit">Add</button>
      {error && <span className="error">{error}</span>}
    </form>
  );
}

export default ItemForm;
