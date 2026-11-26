import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTags, faRotate } from "@fortawesome/free-solid-svg-icons";

const features = [
  {
    icon: faPenToSquare,
    title: "Quick capture",
    text: "Open the app and start typing, no folders to pick first.",
  },
  { icon: faTags, title: "Tags", text: "Group notes by course, week or topic with simple tags." },
  { icon: faRotate, title: "Review mode", text: "Shows yesterday's notes again so they stick." },
];

// Each feature card is built from the array above.
export default function Features() {
  return (
    <section id="features" className="section">
      <h2>Features</h2>
      <div className="grid">
        {features.map(feature => (
          <article key={feature.title} className="card">
            <span className="icon" aria-hidden="true">
              <FontAwesomeIcon icon={feature.icon} aria-hidden="true" focusable="false" />
            </span>
            <h3>{feature.title}</h3>
            <p>{feature.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
