import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import HomeScreen from "./screens/HomeScreen.jsx";
import ProfileScreen from "./screens/ProfileScreen.jsx";
import ShopScreen from "./screens/ShopScreen.jsx";
import PostList from "./components/PostList.jsx";
import Example1 from "./components/Example1.jsx";
import Example2 from "./components/Example2.jsx";
import Example3 from "./components/Example3.jsx";
import WebhookPost from "./components/WebhookPost.jsx";

function App() {
  return (
    <BrowserRouter>
      <main className="page">
        <h1>Week 8 Day 2 · Exercises XP</h1>

        <section className="card">
          <h2>Exercise 1 · React Router</h2>
          <nav className="nav">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/profile">Profile</NavLink>
            <NavLink to="/shop">Shop</NavLink>
          </nav>
          <Routes>
            <Route
              path="/"
              element={
                <ErrorBoundary key="home">
                  <HomeScreen />
                </ErrorBoundary>
              }
            />
            <Route
              path="/profile"
              element={
                <ErrorBoundary key="profile">
                  <ProfileScreen />
                </ErrorBoundary>
              }
            />
            <Route
              path="/shop"
              element={
                <ErrorBoundary key="shop">
                  <ShopScreen />
                </ErrorBoundary>
              }
            />
          </Routes>
        </section>

        <section className="card">
          <h2>Exercise 2 · Display JSON data</h2>
          <PostList />
        </section>

        <section className="card">
          <h2>Exercise 3 · Complex JSON</h2>
          <Example1 />
          <Example2 />
          <Example3 />
        </section>

        <section className="card">
          <h2>Exercise 4 · POST with fetch</h2>
          <WebhookPost />
        </section>
      </main>
    </BrowserRouter>
  );
}

export default App;
