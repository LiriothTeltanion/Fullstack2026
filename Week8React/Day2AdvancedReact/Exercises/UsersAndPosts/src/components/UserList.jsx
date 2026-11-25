import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUsers } from "../api.js";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="muted">Loading users…</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="grid">
      {users.map(user => (
        <Link key={user.id} to={`/users/${user.id}`} className="card user">
          <strong>{user.name}</strong>
          <span className="muted">@{user.username}</span>
          <span>{user.company.name}</span>
        </Link>
      ))}
    </div>
  );
}

export default UserList;
