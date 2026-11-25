import TodoPreview from "./components/TodoPreview.jsx";
import UserSearch from "./components/UserSearch.jsx";
import PagedPosts from "./components/PagedPosts.jsx";

function App() {
  return (
    <main className="page">
      <h1>Week 8 Day 2 · Exercises XP Ninja</h1>

      <section className="card">
        <h2>Exercise 1 · A useFetch hook</h2>
        <TodoPreview />
      </section>

      <section className="card">
        <h2>Exercise 2 · Search fetched users</h2>
        <UserSearch />
      </section>

      <section className="card">
        <h2>Exercise 3 · Pagination</h2>
        <PagedPosts />
      </section>
    </main>
  );
}

export default App;
