import { useEffect, useState } from "react";
import { useDebounce } from "../hooks/useDebounce.js";

function DebouncedSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [requests, setRequests] = useState(0);
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }
    let ignore = false;
    setRequests(n => n + 1);
    // The demo API has only 10 users, so I filter them here after each request.
    fetch("https://jsonplaceholder.typicode.com/users")
      .then(response => response.json())
      .then(users => {
        if (!ignore) {
          const q = debouncedQuery.toLowerCase();
          setResults(users.filter(user => user.name.toLowerCase().includes(q)));
        }
      })
      .catch(() => !ignore && setResults([]));
    return () => {
      ignore = true;
    };
  }, [debouncedQuery]);

  return (
    <div>
      <input
        placeholder="Search users by name"
        value={query}
        onChange={event => setQuery(event.target.value)}
      />
      <p className="muted">Requests sent: {requests}</p>
      <ul>
        {results.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default DebouncedSearch;
