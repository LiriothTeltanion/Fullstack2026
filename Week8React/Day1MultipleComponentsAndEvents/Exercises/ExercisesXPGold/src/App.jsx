import LikeCounter from "./components/LikeCounter.jsx";
import Accordion from "./components/Accordion.jsx";
import TemperatureConverter from "./components/TemperatureConverter.jsx";

function App() {
  return (
    <main className="page">
      <h1>Week 8 Day 1 · Exercises XP Gold</h1>

      <section className="card">
        <h2>Exercise 1 · Lifting state up</h2>
        <LikeCounter />
      </section>

      <section className="card">
        <h2>Exercise 2 · Accordion</h2>
        <Accordion />
      </section>

      <section className="card">
        <h2>Exercise 3 · Temperature converter</h2>
        <TemperatureConverter />
      </section>
    </main>
  );
}

export default App;
