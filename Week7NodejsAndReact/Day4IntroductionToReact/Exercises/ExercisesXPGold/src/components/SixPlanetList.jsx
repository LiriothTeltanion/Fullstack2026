export const sixPlanets = Object.freeze(["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn"]);

// The documented exercise view deliberately contains six, not all eight planets.
export default function SixPlanetList() {
  return (
    <ul
      className="list-group list-group-horizontal-md flex-wrap planet-exercise"
      aria-label="Six-planet exercise list"
    >
      {sixPlanets.map((planet, index) => (
        <li key={planet} className="list-group-item flex-fill d-flex align-items-center gap-2">
          <span className="badge text-bg-info rounded-pill" aria-hidden="true">
            {index + 1}
          </span>
          {planet}
        </li>
      ))}
    </ul>
  );
}
