import { useEffect, useState } from "react";
import { createSwapiClient, loadChallenge } from "./swapi.js";

const client = createSwapiClient();
const number = new Intl.NumberFormat("en");

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setError("");
    setData(null);
    loadChallenge(client)
      .then(result => {
        if (active) setData(result);
      })
      .catch(failure => {
        if (active) setError(failure.message);
      });
    return () => {
      active = false;
    };
  }, [attempt]);

  const max = Math.max(1, ...(data?.planets.map(planet => planet.population ?? 0) ?? []));
  return (
    <main>
      <header>
        <p>Tikal code challenge · SWAPI</p>
        <h1>
          A galaxy,
          <br />
          by the numbers.
        </h1>
      </header>
      {!data && !error && <p role="status">Loading vehicles, pilots and home planets…</p>}
      {error && (
        <div role="alert">
          <p>{error}</p>
          <button onClick={() => setAttempt(value => value + 1)}>Try again</button>
        </div>
      )}
      {data && (
        <>
          <section aria-labelledby="vehicles-title">
            <h2 id="vehicles-title">The largest pilot population total</h2>
            <p>
              Compared {data.vehicleCount} vehicles. Each pilot contributes their home planet's
              population. Unknown values contribute zero and are marked below.
            </p>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Vehicle</th>
                    <th>Population total</th>
                    <th>Pilots and home planets</th>
                  </tr>
                </thead>
                <tbody>
                  {data.winners.map(vehicle => (
                    <tr key={vehicle.name}>
                      <th scope="row">{vehicle.name}</th>
                      <td>{number.format(vehicle.totalPopulation)}</td>
                      <td>
                        <ul>
                          {vehicle.pilots.map((pilot, index) => (
                            <li key={pilot.name + index}>
                              {pilot.name} · {pilot.homeworld.name} ·{" "}
                              {pilot.homeworld.population === null
                                ? "population unknown"
                                : number.format(pilot.homeworld.population)}
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <section aria-labelledby="planets-title">
            <h2 id="planets-title">Five home planets</h2>
            <p>Linear scale. The longest bar represents the most populated of these planets.</p>
            <ul className="chart" aria-label="Planet population bar chart">
              {data.planets.map(planet => (
                <li key={planet.name}>
                  <div className="bar-label">
                    <strong>{planet.name}</strong>
                    <span>
                      {planet.population === null ? "Unknown" : number.format(planet.population)}
                    </span>
                  </div>
                  <div className="track" aria-hidden="true">
                    <div
                      className="bar"
                      style={{ width: ((planet.population ?? 0) / max) * 100 + "%" }}
                    />
                  </div>
                </li>
              ))}
            </ul>
            <p className="legend">
              <span aria-hidden="true">■</span> Total resident population · Source SWAPI
            </p>
          </section>
        </>
      )}
      <footer>
        Data is fetched directly from SWAPI. Shared people and planet requests are cached.
      </footer>
    </main>
  );
}
