import { useEffect, useState } from "react";
import { addItem, deleteItem, getItems, toggleItem } from "./api.js";
import ItemForm from "./components/ItemForm.jsx";
import ItemList from "./components/ItemList.jsx";

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getItems()
      .then(setItems)
      .catch(() => setError("Cannot reach the API. Is the server running on port 5000?"))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async title => {
    const item = await addItem(title);
    setItems([...items, item]);
  };

  const handleToggle = async id => {
    const updated = await toggleItem(id);
    setItems(items.map(item => (item.id === id ? updated : item)));
  };

  const handleDelete = async id => {
    await deleteItem(id);
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <main className="page narrow">
      <h1>Capstone starter</h1>
      <p className="muted">React talks to Express, Express talks to PostgreSQL.</p>
      <ItemForm onAdd={handleAdd} />
      {loading && <p className="muted">Loading…</p>}
      {error && <p className="error">{error}</p>}
      <ItemList items={items} onToggle={handleToggle} onDelete={handleDelete} />
    </main>
  );
}

export default App;
