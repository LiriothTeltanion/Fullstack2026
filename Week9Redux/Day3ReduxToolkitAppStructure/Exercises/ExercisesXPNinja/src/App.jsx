import PostsPage from "./features/posts/PostsPage.jsx";

export default function App() {
  return (
    <main>
      <h1>Users and posts</h1>
      <p className="muted">Both lists are stored normalized with createEntityAdapter.</p>
      <PostsPage />
    </main>
  );
}
