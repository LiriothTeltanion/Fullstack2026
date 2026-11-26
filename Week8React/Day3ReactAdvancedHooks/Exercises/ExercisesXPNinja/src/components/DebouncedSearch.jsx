import { useEffect, useState } from "react";
import { useDebounce } from "../hooks/useDebounce.js";

function DebouncedSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [requests, setRequests] = useState(0);
  const [status, setStatus] = useState("idle");
  const [attempt, setAttempt] = useState(0);
  const search = query.trim();
  const debouncedQuery = useDebounce(search, 500);

  useEffect(() => {
    // Cancel stale work immediately, including during the next debounce delay.
    setResults([]);
    setStatus("idle");
    if (!search || search !== debouncedQuery) return;
    const controller = new AbortController();
    setStatus("loading");
    setRequests(n => n + 1);
    // The demo API has only 10 users, so I filter them here after each request.
    fetch("https://jsonplaceholder.typicode.com/users", { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error("User search failed");
        return response.json();
      })
      .then(users => {
        if (!controller.signal.aborted) {
          setResults(
            users.filter(user => user.name.toLowerCase().includes(debouncedQuery.toLowerCase()))
          );
          setStatus("ready");
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setStatus("error");
      });
    return () => controller.abort();
  }, [search, debouncedQuery, attempt]);

  return (
    <div>
      <input
        aria-label="Search users by name"
        placeholder="Search users by name"
        value={query}
        onChange={event => setQuery(event.target.value)}
      />
      <p className="muted">Requests sent: {requests}</p>
      <p role="status">
        {status === "loading" && "Searching…"}
        {status === "ready" && results.length === 0 && "No matching users."}
        {status === "error" && "Could not load users."}
      </p>
      {status === "error" && <button onClick={() => setAttempt(n => n + 1)}>Retry search</button>}
      <ul>
        {results.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default DebouncedSearch;
