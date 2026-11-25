import { useState } from "react";
import { useDispatch } from "react-redux";
import { CATEGORIES, expenseAdded, expenseUpdated } from "./expensesSlice.js";

const EMPTY = { description: "", amount: "", category: CATEGORIES[0] };

// Used for both adding and editing: `editing` is the expense being edited, or null.
export default function ExpenseForm({ editing, onDone }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState(
    editing ? { ...editing, amount: String(editing.amount) } : EMPTY
  );
  const [error, setError] = useState("");

  const handleChange = event => setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = event => {
    event.preventDefault();
    const amount = Number(form.amount);
    if (!form.description.trim()) return setError("Write a short description.");
    if (!Number.isFinite(amount) || amount <= 0)
      return setError("The amount must be a number above 0.");

    const expense = { description: form.description.trim(), amount, category: form.category };
    if (editing) {
      dispatch(expenseUpdated({ ...expense, id: editing.id }));
    } else {
      dispatch(expenseAdded(expense));
    }
    setForm(EMPTY);
    setError("");
    onDone?.();
  };

  return (
    <form className="row" onSubmit={handleSubmit}>
      <input
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        aria-label="Description"
      />
      <input
        name="amount"
        type="number"
        step="0.01"
        min="0"
        value={form.amount}
        onChange={handleChange}
        placeholder="Amount ₪"
        aria-label="Amount in shekels"
        style={{ width: "8rem" }}
      />
      <select name="category" value={form.category} onChange={handleChange} aria-label="Category">
        {CATEGORIES.map(category => (
          <option key={category}>{category}</option>
        ))}
      </select>
      <button type="submit">{editing ? "Save" : "Add"}</button>
      {editing && (
        <button type="button" className="secondary" onClick={onDone}>
          Cancel
        </button>
      )}
      {error && (
        <p className="error" style={{ width: "100%", margin: 0 }}>
          {error}
        </p>
      )}
    </form>
  );
}
