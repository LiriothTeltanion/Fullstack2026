import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  categoryAdded,
  categoryEdited,
  categoryDeleted,
  categorySelected,
  selectCategories,
  selectSelectedCategoryId,
} from "./categoriesSlice.js";

export default function CategorySelector() {
  const categories = useSelector(selectCategories);
  const selectedId = useSelector(selectSelectedCategoryId);
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [error, setError] = useState("");

  const validName = useCallback(
    (value, exceptId) => {
      if (!value.trim()) {
        setError("Enter a category name.");
        return false;
      }
      if (
        categories.some(
          category =>
            category.id !== exceptId && category.name.toLowerCase() === value.trim().toLowerCase()
        )
      ) {
        setError("That category already exists.");
        return false;
      }
      setError("");
      return true;
    },
    [categories]
  );
  const handleAdd = useCallback(
    event => {
      event.preventDefault();
      if (!validName(name)) return;
      dispatch(categoryAdded(name.trim()));
      setName("");
    },
    [dispatch, name, validName]
  );
  const handleSave = useCallback(
    event => {
      event.preventDefault();
      if (!validName(editingName, editingId)) return;
      dispatch(categoryEdited({ id: editingId, name: editingName.trim() }));
      setEditingId(null);
    },
    [dispatch, editingId, editingName, validName]
  );
  const handleDelete = useCallback(
    category => {
      if (!window.confirm("Delete " + category.name + "? Its tasks will become Uncategorized."))
        return;
      dispatch(categoryDeleted(category.id));
      if (editingId === category.id) setEditingId(null);
    },
    [dispatch, editingId]
  );
  const handleSelect = useCallback(id => dispatch(categorySelected(id)), [dispatch]);

  return (
    <section className="card">
      <h2>Categories</h2>
      <div className="row">
        {[
          { id: "all", name: "All" },
          { id: "uncategorized", name: "Uncategorized" },
          ...categories,
        ].map(category => (
          <button
            key={category.id}
            className={category.id === selectedId ? "" : "secondary"}
            onClick={() => handleSelect(category.id)}
            aria-pressed={category.id === selectedId}
          >
            {category.name}
          </button>
        ))}
      </div>
      <form className="row" onSubmit={handleAdd} style={{ marginTop: 10 }}>
        <input
          value={name}
          onChange={event => setName(event.target.value)}
          placeholder="New category"
          aria-label="New category"
        />
        <button type="submit">Add category</button>
      </form>
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      <ul className="plain">
        {categories.map(category => (
          <li key={category.id} className="row">
            {editingId === category.id ? (
              <form className="row" onSubmit={handleSave}>
                <input
                  value={editingName}
                  onChange={event => setEditingName(event.target.value)}
                  aria-label="Category name"
                  autoFocus
                />
                <button type="submit">Save category</button>
                <button type="button" className="secondary" onClick={() => setEditingId(null)}>
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <span>{category.name}</span>
                <button
                  type="button"
                  className="secondary"
                  aria-label={"Edit category " + category.name}
                  onClick={() => {
                    setEditingId(category.id);
                    setEditingName(category.name);
                    setError("");
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="danger"
                  aria-label={"Delete category " + category.name}
                  onClick={() => handleDelete(category)}
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
