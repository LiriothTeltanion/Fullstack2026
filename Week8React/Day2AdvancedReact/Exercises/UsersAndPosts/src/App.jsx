import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import UserList from "./components/UserList.jsx";
import UserPosts from "./components/UserPosts.jsx";

function App() {
  return (
    <BrowserRouter>
      <main className="page">
        <h1>
          <Link to="/">Users and Posts</Link>
        </h1>
        <Routes>
          <Route path="/" element={<UserList />} />
          <Route path="/users/:userId" element={<UserPosts />} />
          <Route path="*" element={<p>Page not found.</p>} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
