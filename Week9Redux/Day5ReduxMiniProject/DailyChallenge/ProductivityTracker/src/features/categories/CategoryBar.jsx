import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  categoryAdded,
  categorySelected,
  selectCategories,
  selectSelectedCategoryId,
} from "./categoriesSlice.js";

export default function CategoryBar() {
  const categories = useSelector(selectCategories);
  const selectedId = useSelector(selectSelectedCategoryId);
  const dispatch = useDispatch();
  const [name, setName] = useState("");

  const handleSubmit = event => {
    event.preventDefault();
    if (!name.trim()) return;
    dispatch(categoryAdded(name.trim()));
    setName("");
  };

  return (
    <section className="card">
      <div className="row">
        {[{ id: "all", name: "All" }, ...categories].map(category => (
          <button
            key={category.id}
            className={category.id === selectedId ? "" : "secondary"}
            onClick={() => dispatch(categorySelected(category.id))}
            aria-pressed={category.id === selectedId}
          >
            {category.name}
          </button>
        ))}
      </div>
      <form className="row" onSubmit={handleSubmit} style={{ marginTop: 10 }}>
        <input
          value={name}
          onChange={event => setName(event.target.value)}
          placeholder="New category"
          aria-label="New category"
        />
        <button type="submit">Add category</button>
      </form>
    </section>
  );
}
