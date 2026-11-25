import Card from "./components/Card.jsx";
import PlanetList from "./components/PlanetList.jsx";
import SocialMedia from "./components/SocialMedia.jsx";
import { celebrities, planets, socialLinks } from "./data.js";

export default function App() {
  return (
    <main>
      <h2>Exercise 1 · Cards with props</h2>
      <div className="cards">
        {celebrities.map(person => (
          // Spreading the object passes every field as its own prop.
          <Card key={person.name} {...person} />
        ))}
      </div>

      <h2>Exercise 2 · Planets</h2>
      <PlanetList planets={planets} />

      <h2>Exercise 3 · Social links</h2>
      <SocialMedia links={socialLinks} />
    </main>
  );
}
