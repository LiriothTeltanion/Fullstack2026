import Tabs from "./components/Tabs.jsx";
import StarRating from "./components/StarRating.jsx";
import MouseTracker from "./components/MouseTracker.jsx";

const tabs = [
  { label: "HTML", content: "The structure of the page." },
  { label: "CSS", content: "The look of the page." },
  { label: "React", content: "Components that update the page for me." },
];

function App() {
  return (
    <main className="page">
      <h1>Week 8 Day 1 · Exercises XP Ninja</h1>

      <section className="card">
        <h2>Exercise 1 · Tabs</h2>
        <Tabs tabs={tabs} />
      </section>

      <section className="card">
        <h2>Exercise 2 · Star rating</h2>
        <StarRating max={5} />
      </section>

      <section className="card">
        <h2>Exercise 3 · Mouse tracker</h2>
        <MouseTracker />
      </section>
    </main>
  );
}

export default App;
