import AgeTracker from "./features/age/AgeTracker.jsx";

export default function App() {
  return (
    <main>
      <h1>Age tracker</h1>
      <p className="muted">Every change waits one second, like a slow server would.</p>
      <AgeTracker />
    </main>
  );
}
