import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getForecast } from "../api/weather.js";
import { useWeather } from "../context/WeatherContext.jsx";
import { describeWeather } from "../utils/weatherCodes.js";

function FavoriteCard({ city, unit }) {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    getForecast(city, unit)
      .then(data => setCurrent(data.current))
      .catch(() => setCurrent(null));
  }, [city, unit]);

  return (
    <button className="card favorite" onClick={() => navigate("/", { state: { city } })}>
      <strong>{city.name}</strong>
      <span className="muted">{city.country}</span>
      {current ? (
        <span className="big">
          {describeWeather(current.code).icon} {current.temperature}°{unit}
        </span>
      ) : (
        <span className="muted">Loading…</span>
      )}
    </button>
  );
}

function Favorites() {
  const { favorites, unit } = useWeather();

  if (favorites.length === 0) {
    return <p className="muted">No favorites yet. Add a city from the Home page.</p>;
  }

  return (
    <div className="favorites">
      {favorites.map(city => (
        <FavoriteCard key={city.id} city={city} unit={unit} />
      ))}
    </div>
  );
}

export default Favorites;
