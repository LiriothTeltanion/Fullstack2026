import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "./usersSlice.js";

export default function UserData() {
  const { items, status } = useSelector(state => state.users);
  const dispatch = useDispatch();
  useEffect(() => {
    if (status === "idle") dispatch(fetchUsers());
  }, [dispatch, status]);
  return (
    <section className="card" aria-label="Users">
      <h2>Users</h2>
      <button disabled={status === "loading"} onClick={() => dispatch(fetchUsers())}>
        Reload users
      </button>
      {status === "loading" && <p role="status">Loading users…</p>}
      {status === "failed" && <p role="alert">Users could not be loaded. Try again.</p>}
      {status === "succeeded" && (
        <ul className="plain">
          {items.map(user => (
            <li key={user.id}>
              {user.name} · {user.email}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
