import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPostsByUser,
  fetchUsers,
  selectSelectedEntry,
  userSelected,
} from "./directorySlice.js";

export default function Directory() {
  const { users, usersStatus, selectedUserId } = useSelector(state => state.directory);
  const entry = useSelector(selectSelectedEntry);
  const dispatch = useDispatch();

  useEffect(() => {
    if (usersStatus === "idle") dispatch(fetchUsers());
  }, [usersStatus, dispatch]);

  // Switching users quickly aborts the request for the previous one.
  useEffect(() => {
    if (selectedUserId === null) return undefined;
    const promise = dispatch(fetchPostsByUser(selectedUserId));
    return () => promise.abort();
  }, [selectedUserId, dispatch]);

  return (
    <div className="layout">
      <section className="card">
        <h2>Users</h2>
        {usersStatus === "loading" && (
          <div className="spinner" role="status" aria-label="Loading users" />
        )}
        {usersStatus === "failed" && <p className="error">Could not load users.</p>}
        <ul className="plain">
          {users.map(user => (
            <li key={user.id}>
              <button
                className={user.id === selectedUserId ? "" : "secondary"}
                onClick={() => dispatch(userSelected(user.id))}
                aria-pressed={user.id === selectedUserId}
              >
                {user.name}
              </button>
            </li>
          ))}
        </ul>
      </section>
      <section className="card">
        <h2>Posts</h2>
        {!entry && <p className="muted">Pick a user.</p>}
        {entry?.status === "loading" && (
          <div className="spinner" role="status" aria-label="Loading posts" />
        )}
        {entry?.status === "failed" && <p className="error">{entry.error}</p>}
        {entry?.status === "succeeded" && (
          <ol>
            {entry.items.map(post => (
              <li key={post.id}>{post.title}</li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
