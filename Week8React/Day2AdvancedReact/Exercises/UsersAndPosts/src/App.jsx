import { BrowserRouter, Link, Route, Routes, useParams } from "react-router-dom";
import UsersList from "./components/UsersList.jsx";
import PostList from "./components/PostList.jsx";

// Router hooks stay in this small adapter; the data-loading exercise uses classes.
function PostsRoute() {
  const { userId } = useParams();
  return <PostList userId={userId} />;
}

function App() {
  return (
    <BrowserRouter>
      <main className="page">
        <h1>
          <Link to="/">Users and Posts</Link>
        </h1>
        <Routes>
          <Route path="/" element={<UsersList />} />
          <Route path="/users/:userId" element={<PostsRoute />} />
          <Route path="*" element={<p>Page not found.</p>} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
