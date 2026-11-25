import { useState } from "react";
import { useFetch } from "../hooks/useFetch.js";

function TodoPreview() {
  const [id, setId] = useState(1);
  const { data, loading, error } = useFetch(`https://jsonplaceholder.typicode.com/todos/${id}`);

  return (
    <div>
      <button onClick={() => setId(id - 1)} disabled={id === 1}>
        Previous
      </button>{" "}
      <button onClick={() => setId(id + 1)}>Next</button>
      {loading && <p className="muted">Loading todo {id}…</p>}
      {error && <p className="error">Error: {error}</p>}
      {data && !loading && (
        <p>
          #{data.id} {data.title} {data.completed ? "✅" : "⬜"}
        </p>
      )}
    </div>
  );
}

export default TodoPreview;
