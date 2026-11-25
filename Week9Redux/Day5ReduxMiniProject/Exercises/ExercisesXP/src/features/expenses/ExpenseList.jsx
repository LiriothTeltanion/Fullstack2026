import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ExpenseForm from "./ExpenseForm.jsx";
import {
  CATEGORIES,
  expenseDeleted,
  filterChanged,
  selectFilter,
  selectTotal,
  selectVisibleExpenses,
} from "./expensesSlice.js";

export default function ExpenseList() {
  const expenses = useSelector(selectVisibleExpenses);
  const total = useSelector(selectTotal);
  const filter = useSelector(selectFilter);
  const dispatch = useDispatch();
  const [editingId, setEditingId] = useState(null);

  return (
    <section className="card">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h2>Expenses</h2>
        <select
          value={filter}
          onChange={event => dispatch(filterChanged(event.target.value))}
          aria-label="Filter by category"
        >
          {["All", ...CATEGORIES].map(category => (
            <option key={category}>{category}</option>
          ))}
        </select>
      </div>
      <ul className="plain">
        {expenses.map(expense =>
          expense.id === editingId ? (
            <li key={expense.id}>
              <ExpenseForm editing={expense} onDone={() => setEditingId(null)} />
            </li>
          ) : (
            <li key={expense.id}>
              <span>
                {expense.description} <span className="muted">· {expense.category}</span>
              </span>
              <span className="row">
                <strong>₪{expense.amount.toFixed(2)}</strong>
                <button className="secondary" onClick={() => setEditingId(expense.id)}>
                  Edit
                </button>
                <button className="danger" onClick={() => dispatch(expenseDeleted(expense.id))}>
                  Delete
                </button>
              </span>
            </li>
          )
        )}
      </ul>
      <p>
        <strong>Total: ₪{total.toFixed(2)}</strong>
      </p>
    </section>
  );
}
