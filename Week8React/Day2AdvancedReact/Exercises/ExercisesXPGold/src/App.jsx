import { useState } from "react";
import FavoriteColor from "./components/FavoriteColor.jsx";
import Child from "./components/Child.jsx";
import ColorWithHooks from "./components/ColorWithHooks.jsx";

function App() {
  const [show, setShow] = useState(true);

  return (
    <main className="page">
      <h1>Week 8 Day 2 · Exercises XP Gold</h1>
      <p className="muted">Open the console to see the lifecycle messages.</p>

      <section className="card">
        <h2>Exercise 1 · Lifecycle methods</h2>
        <FavoriteColor />
      </section>

      <section className="card">
        <h2>Exercise 2 · Unmounting</h2>
        {show && <Child />}
        <button onClick={() => setShow(false)} disabled={!show}>
          Delete
        </button>
      </section>

      <section className="card">
        <h2>Exercise 3 · The same with hooks</h2>
        <ColorWithHooks />
      </section>
    </main>
  );
}

export default App;
