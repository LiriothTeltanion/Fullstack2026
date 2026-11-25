import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPostsByUser, getUser } from "../api.js";

function UserPosts() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    // Both requests start together and we wait for both.
    Promise.all([getUser(userId), getPostsByUser(userId)])
      .then(([userData, postData]) => {
        setUser(userData);
        setPosts(postData);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <p className="muted">Loading posts…</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <Link to="/">← All users</Link>
      <h2>{user.name}</h2>
      <p className="muted">
        {user.email} · {user.address.city}
      </p>
      <h3>{posts.length} posts</h3>
      {posts.map(post => (
        <article key={post.id} className="card">
          <h4>{post.title}</h4>
          <p>{post.body}</p>
        </article>
      ))}
    </div>
  );
}

export default UserPosts;
