import { useEffect, useState } from "react";
import { searchCities } from "../api/weather.js";

function SearchBar({ onSelect }) {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState([]);
  const [error, setError] = useState("");

  const handleChange = event => {
    const value = event.target.value;
    // The assignment asks for English letters only.
    if (/[^a-zA-Z\s-]/.test(value)) {
      setError("Please use English letters only.");
      return;
    }
    setError("");
    setQuery(value);
  };

  // Wait 400 ms after the last key before asking for suggestions.
  useEffect(() => {
    if (query.trim().length < 2) {
      setOptions([]);
      return;
    }
    let ignore = false;
    const timer = setTimeout(() => {
      searchCities(query.trim())
        .then(cities => !ignore && setOptions(cities))
        .catch(err => !ignore && setError(err.message));
    }, 400);
    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [query]);

  const choose = city => {
    onSelect(city);
    setQuery("");
    setOptions([]);
  };

  return (
    <div className="search">
      <input
        value={query}
        onChange={handleChange}
        placeholder="Search a city"
        aria-label="Search a city"
      />
      {error && <p className="error">{error}</p>}
      {options.length > 0 && (
        <ul className="options">
          {options.map(city => (
            <li key={city.id}>
              <button onClick={() => choose(city)}>
                {city.name}, {city.country}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
