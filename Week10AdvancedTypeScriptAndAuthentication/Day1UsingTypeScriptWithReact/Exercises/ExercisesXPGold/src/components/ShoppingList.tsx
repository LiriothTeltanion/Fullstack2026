import { useEffect, useReducer, useState, type FormEvent } from "react";
import { shoppingReducer, type Item } from "../state/shoppingReducer";

const KEY = "gold-shopping";

function loadItems(): Item[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as Item[];
  } catch {
    return [];
  }
}

export default function ShoppingList() {
  const [items, dispatch] = useReducer(shoppingReducer, [], loadItems);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) return;
    dispatch({ type: "added", name: name.trim(), quantity });
    setName("");
    setQuantity(1);
  };

  return (
    <section className="card">
      <h2>Shopping list (useReducer)</h2>
      <form className="row" onSubmit={handleSubmit}>
        <input
          value={name}
          onChange={event => setName(event.target.value)}
          placeholder="Item"
          aria-label="Item"
        />
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={event => setQuantity(Math.max(1, Number(event.target.value)))}
          aria-label="Quantity"
          style={{ width: "5rem" }}
        />
        <button type="submit">Add</button>
      </form>
      <ul className="plain">
        {items.map(item => (
          <li key={item.id}>
            <label className={item.bought ? "done" : ""}>
              <input
                type="checkbox"
                checked={item.bought}
                onChange={() => dispatch({ type: "toggled", id: item.id })}
              />{" "}
              {item.quantity} × {item.name}
            </label>
            <button className="danger" onClick={() => dispatch({ type: "removed", id: item.id })}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <button
        className="secondary"
        onClick={() => dispatch({ type: "clearedBought" })}
        disabled={!items.some(item => item.bought)}
      >
        Clear bought items
      </button>
    </section>
  );
}
