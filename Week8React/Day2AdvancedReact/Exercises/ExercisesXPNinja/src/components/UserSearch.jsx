import { useState } from "react";
import { useFetch } from "../hooks/useFetch.js";

function UserSearch() {
  const [search, setSearch] = useState("");
  const { data: users, loading, error } = useFetch("https://jsonplaceholder.typicode.com/users");

  if (loading) return <p className="muted">Loading users…</p>;
  if (error) return <p className="error">Error: {error}</p>;

  // Filtering happens on every render, the list itself is fetched once.
  const filtered = users.filter(user => user.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <input
        placeholder="Search by name"
        value={search}
        onChange={event => setSearch(event.target.value)}
      />
      <p className="muted">
        {filtered.length} of {users.length} users
      </p>
      <ul>
        {filtered.map(user => (
          <li key={user.id}>
            {user.name} · {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserSearch;
