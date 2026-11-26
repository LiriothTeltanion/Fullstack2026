import { useEffect, useState } from "react";
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
  const [postsAttempt, setPostsAttempt] = useState(0);

  useEffect(() => {
    if (usersStatus === "idle") dispatch(fetchUsers());
  }, [usersStatus, dispatch]);

  // Switching users quickly aborts the request for the previous one.
  useEffect(() => {
    if (selectedUserId === null) return undefined;
    const promise = dispatch(fetchPostsByUser(selectedUserId));
    return () => promise.abort();
  }, [selectedUserId, postsAttempt, dispatch]);

  return (
    <div className="layout">
      <section className="card">
        <h2>Users</h2>
        {usersStatus === "loading" && (
          <div className="spinner" role="status" aria-label="Loading users" />
        )}
        {usersStatus === "failed" && (
          <>
            <p className="error" role="alert">
              Could not load users.
            </p>
            <button onClick={() => dispatch(fetchUsers())}>Retry users</button>
          </>
        )}
        {usersStatus === "succeeded" && users.length === 0 && (
          <p className="muted">No users found.</p>
        )}
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
        {entry?.status === "failed" && (
          <>
            <p className="error" role="alert">
              Could not load posts. {entry.error}
            </p>
            <button onClick={() => setPostsAttempt(attempt => attempt + 1)}>Retry posts</button>
          </>
        )}
        {entry?.status === "succeeded" && entry.items.length === 0 && (
          <p className="muted">This user has no posts.</p>
        )}
        {entry?.status === "succeeded" && entry.items.length > 0 && (
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
