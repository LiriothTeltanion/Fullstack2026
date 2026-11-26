import { useEffect, useReducer, useRef, useState, type FormEvent } from "react";
import { restoreItems, shoppingReducer, type Item } from "../state/shoppingReducer";

const KEY = "gold-shopping";

function loadItems(): Item[] {
  try {
    return restoreItems(JSON.parse(localStorage.getItem(KEY) ?? "[]"));
  } catch {
    return [];
  }
}

export default function ShoppingList() {
  const [items, dispatch] = useReducer(shoppingReducer, [], loadItems);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [saveFailed, setSaveFailed] = useState(false);
  const previousItems = useRef(items);

  useEffect(() => {
    // Opening a saved list should not write to storage before the first edit.
    if (items === previousItems.current) return;
    previousItems.current = items;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
      setSaveFailed(false);
    } catch {
      setSaveFailed(true);
    }
  }, [items]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const count = Number(quantity);
    if (!name.trim() || !Number.isSafeInteger(count) || count < 1) return;
    dispatch({ type: "added", name: name.trim(), quantity: count });
    setName("");
    setQuantity("1");
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
          required
          pattern=".*\S.*"
        />
        <input
          type="number"
          min={1}
          max={Number.MAX_SAFE_INTEGER}
          required
          value={quantity}
          onChange={event => setQuantity(event.target.value)}
          aria-label="Quantity"
          style={{ width: "5rem" }}
        />
        <button type="submit">Add</button>
      </form>
      {saveFailed && (
        <p role="status">
          Changes are available in this tab. Your browser could not save the list.
        </p>
      )}
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
