// Exercise 2: render an array of strings with map() and a key.
export default function PlanetList({ planets }) {
  return (
    <ul className="planets">
      {planets.map((planet, index) => (
        <li key={planet}>
          {index + 1}. {planet}
        </li>
      ))}
    </ul>
  );
}
