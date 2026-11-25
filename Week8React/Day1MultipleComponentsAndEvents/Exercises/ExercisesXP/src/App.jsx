import Car from "./components/Car.jsx";
import Events from "./components/Events.jsx";
import Phone from "./components/Phone.jsx";
import Color from "./components/Color.jsx";

const carInfo = { name: "Ford", model: "Mustang" };

function App() {
  return (
    <main className="page">
      <h1>Week 8 Day 1 · Exercises XP</h1>

      <section className="card">
        <h2>Exercise 1 · Car and Garage</h2>
        <Car carInfo={carInfo} />
      </section>

      <section className="card">
        <h2>Exercise 2 · Events</h2>
        <Events />
      </section>

      <section className="card">
        <h2>Exercise 3 · Phone and its state</h2>
        <Phone />
      </section>

      <section className="card">
        <h2>Exercise 4 · useEffect</h2>
        <Color />
      </section>
    </main>
  );
}

export default App;
