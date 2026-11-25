function ItemList({ items, onToggle, onDelete }) {
  if (items.length === 0) return null;

  return (
    <ul className="card items">
      {items.map(item => (
        <li key={item.id} className={item.done ? "done" : ""}>
          <label>
            <input type="checkbox" checked={item.done} onChange={() => onToggle(item.id)} />{" "}
            {item.title}
          </label>
          <button onClick={() => onDelete(item.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}

export default ItemList;
