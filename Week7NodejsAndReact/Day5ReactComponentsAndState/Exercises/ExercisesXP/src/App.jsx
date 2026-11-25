import Car from "./components/Car.jsx";
import Events from "./components/Events.jsx";
import Phone from "./components/Phone.jsx";
import Color from "./components/Color.jsx";

const carInfo = { name: "Ford", model: "Mustang" };

export default function App() {
  return (
    <main>
      <section>
        <h2>Exercise 1 · Car and Garage</h2>
        <Car carInfo={carInfo} />
      </section>
      <section>
        <h2>Exercise 2 · Events</h2>
        <Events />
      </section>
      <section>
        <h2>Exercise 3 · Phone</h2>
        <Phone />
      </section>
      <section>
        <h2>Exercise 4 · useEffect</h2>
        <Color />
      </section>
    </main>
  );
}
