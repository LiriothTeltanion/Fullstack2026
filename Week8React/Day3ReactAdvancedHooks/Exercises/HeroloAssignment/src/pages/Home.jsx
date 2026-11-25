import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getForecast } from "../api/weather.js";
import { useWeather } from "../context/WeatherContext.jsx";
import { describeWeather } from "../utils/weatherCodes.js";
import SearchBar from "../components/SearchBar.jsx";
import ForecastList from "../components/ForecastList.jsx";

const TEL_AVIV = {
  id: 293397,
  name: "Tel Aviv",
  country: "Israel",
  latitude: 32.08088,
  longitude: 34.78057,
};

function Home() {
  const location = useLocation();
  const { favorites, unit, dispatch } = useWeather();
  // A favorite card sends its city here through the router state.
  const [city, setCity] = useState(location.state?.city || TEL_AVIV);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    setError("");
    getForecast(city, unit)
      .then(data => !ignore && setForecast(data))
      .catch(err => !ignore && setError(err.message));
    return () => {
      ignore = true;
    };
  }, [city, unit]);

  const isFavorite = favorites.some(fav => fav.id === city.id);
  const weather = forecast && describeWeather(forecast.current.code);

  return (
    <>
      <SearchBar onSelect={setCity} />
      {error && <p className="error">{error}</p>}
      {forecast && (
        <section className="card">
          <div className="current">
            <div>
              <h2>
                {city.name}, {city.country}
              </h2>
              <p className="big">
                {weather.icon} {forecast.current.temperature}°{unit}
              </p>
              <p>{weather.label}</p>
            </div>
            <button onClick={() => dispatch({ type: "toggleFavorite", city })}>
              {isFavorite ? "♥ Remove from favorites" : "♡ Add to favorites"}
            </button>
          </div>
          <ForecastList days={forecast.days} unit={unit} />
        </section>
      )}
    </>
  );
}

export default Home;
