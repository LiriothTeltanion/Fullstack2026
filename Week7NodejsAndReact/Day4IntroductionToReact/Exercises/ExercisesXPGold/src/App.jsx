import BootstrapCard from "./components/BootstrapCard.jsx";
import SixPlanetList from "./components/SixPlanetList.jsx";
import OriginalExercises from "./OriginalExercises.jsx";
import { celebrities } from "./data.js";

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to the exercises
      </a>
      <main id="main" tabIndex="-1" className="exercise-shell" data-bs-theme="dark">
        <header className="mb-5">
          <p className="eyebrow text-info">React · props · reusable components</p>
          <h1 className="display-5 fw-bold">Small components, two ways.</h1>
          <p className="lead text-body-secondary">
            Three profile cards powered by Bootstrap, a six-planet list, and the original examples
            kept alongside them.
          </p>
        </header>
        <section aria-labelledby="cards-title" className="mb-5">
          <h2 id="cards-title" className="h4">
            1. Bootstrap cards with props
          </h2>
          <div className="row g-3">
            {celebrities.map(person => (
              <div className="col-12 col-md-6 col-lg-4" key={person.name}>
                <BootstrapCard {...person} />
              </div>
            ))}
          </div>
        </section>
        <section aria-labelledby="planets-title" className="mb-5">
          <h2 id="planets-title" className="h4">
            2. A six-planet exercise list
          </h2>
          <p className="text-body-secondary">
            The first six planets in order from the Sun. The complete eight-planet version remains
            in the original examples.
          </p>
          <SixPlanetList />
        </section>
        <details className="original-examples">
          <summary className="h5">Compare the original custom components</summary>
          <div className="pt-4">
            <OriginalExercises />
          </div>
        </details>
        <footer className="small text-body-secondary mt-4">
          Bootstrap CSS is bundled locally through npm; this page makes no remote asset requests.
        </footer>
      </main>
    </>
  );
}
