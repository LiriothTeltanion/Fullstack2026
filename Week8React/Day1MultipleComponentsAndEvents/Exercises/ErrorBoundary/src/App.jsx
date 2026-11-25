import BuggyCounter from "./components/BuggyCounter.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

function App() {
  return (
    <main className="page">
      <h1>Week 8 Day 1 · Error Boundary</h1>
      <p className="muted">Each counter crashes when it reaches 5.</p>

      <section className="card">
        <h2>Simulation 1 · two counters, one boundary</h2>
        <p className="muted">When one crashes, both disappear.</p>
        <ErrorBoundary>
          <BuggyCounter />
          <BuggyCounter />
        </ErrorBoundary>
      </section>

      <section className="card">
        <h2>Simulation 2 · one boundary each</h2>
        <p className="muted">When one crashes, the other keeps working.</p>
        <ErrorBoundary>
          <BuggyCounter />
        </ErrorBoundary>
        <ErrorBoundary>
          <BuggyCounter />
        </ErrorBoundary>
      </section>

      <section className="card">
        <h2>Simulation 3 · no boundary here</h2>
        <p className="muted">The error climbs up to the boundary around the whole app.</p>
        <BuggyCounter />
      </section>
    </main>
  );
}

export default App;
