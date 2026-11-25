import { useState } from "react";

let nextId = 3;

// Exercise 2: add, toggle and remove items in an array kept in state.
export default function ShoppingList() {
  const [items, setItems] = useState([
    { id: 1, name: "Green tea", bought: false },
    { id: 2, name: "Coffee beans", bought: true },
  ]);
  const [text, setText] = useState("");

  function addItem(event) {
    event.preventDefault();
    const name = text.trim();
    if (!name) return;
    setItems(list => [...list, { id: nextId++, name, bought: false }]);
    setText("");
  }

  const toggle = id =>
    setItems(list => list.map(item => (item.id === id ? { ...item, bought: !item.bought } : item)));
  const remove = id => setItems(list => list.filter(item => item.id !== id));

  const left = items.filter(item => !item.bought).length;

  return (
    <div>
      <form className="row" onSubmit={addItem}>
        <input value={text} onChange={e => setText(e.target.value)} placeholder="Add an item" />
        <button type="submit">Add</button>
      </form>
      <ul className="list">
        {items.map(item => (
          <li key={item.id}>
            <label className={item.bought ? "bought" : ""}>
              <input type="checkbox" checked={item.bought} onChange={() => toggle(item.id)} />{" "}
              {item.name}
            </label>
            <button onClick={() => remove(item.id)} aria-label={`Remove ${item.name}`}>
              ✕
            </button>
          </li>
        ))}
      </ul>
      <p>{left === 0 ? "Everything is bought." : `${left} item(s) left to buy.`}</p>
    </div>
  );
}
