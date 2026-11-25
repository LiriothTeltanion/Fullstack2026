import posts from "../data/posts.json";

function PostList() {
  return (
    <div>
      {posts.map(post => (
        <article key={post.id} className="post">
          <h3>{post.title}</h3>
          <p>{post.content}</p>
        </article>
      ))}
    </div>
  );
}

export default PostList;
