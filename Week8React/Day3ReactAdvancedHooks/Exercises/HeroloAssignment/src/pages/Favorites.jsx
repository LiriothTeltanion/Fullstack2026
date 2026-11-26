import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getForecast } from "../api/weather.js";
import { useWeather } from "../context/WeatherContext.jsx";
import { describeForecast } from "../utils/weatherCodes.js";
import WeatherAttribution from "../components/WeatherAttribution.jsx";

function FavoriteCard({ city, unit }) {
  const navigate = useNavigate();
  const [result, setCurrent] = useState(null);
  const current = result?.city === city && result.unit === unit ? result.data : null;
  const [error, setError] = useState(false);

  useEffect(() => {
    let ignore = false;
    setCurrent(null);
    setError(false);
    getForecast(city, unit)
      .then(data => {
        if (!ignore) setCurrent({ data: data.current, city, unit });
      })
      .catch(() => {
        if (!ignore) setError(true);
      });
    return () => {
      ignore = true;
    };
  }, [city, unit]);

  return (
    <button className="card favorite" onClick={() => navigate("/", { state: { city } })}>
      <strong>{city.name}</strong>
      <span className="muted">{city.country}</span>
      <span className="muted">
        {city.provider === "accuweather" ? "AccuWeather" : "Open-Meteo"}
      </span>
      {current ? (
        <span className="big">
          {describeForecast(current).icon} {current.temperature}°{unit}
        </span>
      ) : (
        <span className="muted">{error ? "Weather unavailable; open to retry." : "Loading…"}</span>
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
      {favorites.some(city => city.provider === "accuweather") && (
        <WeatherAttribution provider="accuweather" />
      )}
    </div>
  );
}

export default Favorites;
