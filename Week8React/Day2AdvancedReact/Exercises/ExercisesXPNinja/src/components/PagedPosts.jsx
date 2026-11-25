import { useState } from "react";
import { useFetch } from "../hooks/useFetch.js";

const PAGE_SIZE = 5;

function PagedPosts() {
  const [page, setPage] = useState(1);
  const { data: posts, loading, error } = useFetch("https://jsonplaceholder.typicode.com/posts");

  if (loading) return <p className="muted">Loading posts…</p>;
  if (error) return <p className="error">Error: {error}</p>;

  const pageCount = Math.ceil(posts.length / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const visible = posts.slice(start, start + PAGE_SIZE);

  return (
    <div>
      <ol start={start + 1}>
        {visible.map(post => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ol>
      <button onClick={() => setPage(page - 1)} disabled={page === 1}>
        Previous
      </button>{" "}
      <span>
        Page {page} of {pageCount}
      </span>{" "}
      <button onClick={() => setPage(page + 1)} disabled={page === pageCount}>
        Next
      </button>
    </div>
  );
}

export default PagedPosts;
