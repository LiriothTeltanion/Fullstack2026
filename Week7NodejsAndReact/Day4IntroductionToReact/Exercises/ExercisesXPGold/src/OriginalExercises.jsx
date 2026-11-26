import Card from "./components/Card.jsx";
import PlanetList from "./components/PlanetList.jsx";
import SocialMedia from "./components/SocialMedia.jsx";
import { celebrities, planets, socialLinks } from "./data.js";

// Keep the earlier custom-card and eight-planet examples available for comparison.
export default function OriginalExercises() {
  return (
    <section aria-label="Original custom components">
      <h3 className="h5">Original cards with props</h3>
      <div className="cards">
        {celebrities.map(person => (
          <Card key={person.name} {...person} />
        ))}
      </div>
      <h3 className="h5 mt-4">Original eight-planet list</h3>
      <PlanetList planets={planets} />
      <h3 className="h5 mt-4">Original social links</h3>
      <SocialMedia links={socialLinks} />
    </section>
  );
}
