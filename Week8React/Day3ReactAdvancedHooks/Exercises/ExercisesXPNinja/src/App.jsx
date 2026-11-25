import PrimeFinder from "./components/PrimeFinder.jsx";
import RenderCounter from "./components/RenderCounter.jsx";
import DebouncedSearch from "./components/DebouncedSearch.jsx";

function App() {
  return (
    <main className="page">
      <h1>Week 8 Day 3 · Exercises XP Ninja</h1>

      <section className="card">
        <h2>Exercise 1 · useMemo</h2>
        <PrimeFinder />
      </section>

      <section className="card">
        <h2>Exercise 2 · React.memo and useCallback</h2>
        <RenderCounter />
      </section>

      <section className="card">
        <h2>Exercise 3 · A useDebounce hook</h2>
        <DebouncedSearch />
      </section>
    </main>
  );
}

export default App;
