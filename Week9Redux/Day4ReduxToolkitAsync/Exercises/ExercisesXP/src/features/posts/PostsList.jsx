import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUserName } from "../users/usersSlice.js";
import { fetchPosts, selectPosts, selectPostsError, selectPostsStatus } from "./postsSlice.js";

function PostAuthor({ userId }) {
  const name = useSelector(state => selectUserName(state, userId));
  return <span className="muted">by {name}</span>;
}

export default function PostsList() {
  const posts = useSelector(selectPosts);
  const status = useSelector(selectPostsStatus);
  const error = useSelector(selectPostsError);
  const dispatch = useDispatch();

  // Load once: only when nothing has been requested yet.
  useEffect(() => {
    if (status === "idle") dispatch(fetchPosts());
  }, [status, dispatch]);

  return (
    <section className="card">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h2>Latest posts</h2>
        <button
          className="secondary"
          onClick={() => dispatch(fetchPosts())}
          disabled={status === "loading"}
        >
          Reload
        </button>
      </div>
      {status === "loading" && <div className="spinner" role="status" aria-label="Loading posts" />}
      {status === "failed" && <p className="error">Could not load posts: {error}</p>}
      {status === "succeeded" && (
        <ul className="plain">
          {posts.map(post => (
            <li key={post.id} style={{ display: "block" }}>
              <strong>{post.title}</strong> <PostAuthor userId={post.userId} />
              <p>{post.body}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
