import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getForecast } from "../api/weather.js";
import { useWeather } from "../context/WeatherContext.jsx";
import { describeForecast } from "../utils/weatherCodes.js";
import SearchBar from "../components/SearchBar.jsx";
import ForecastList from "../components/ForecastList.jsx";
import WeatherAttribution from "../components/WeatherAttribution.jsx";

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
  const [result, setForecast] = useState(null);
  // Hide a previous city/unit synchronously, before the next effect runs.
  const forecast = result?.city === city && result.unit === unit ? result.data : null;
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const provider = city.provider === "accuweather" ? "accuweather" : "open-meteo";

  useEffect(() => {
    let ignore = false;
    setError("");
    setForecast(null);
    getForecast(city, unit)
      .then(data => !ignore && setForecast({ data, city, unit }))
      .catch(err => !ignore && setError(err.message));
    return () => {
      ignore = true;
    };
  }, [city, unit, attempt]);

  // A geoposition lookup supplies the same canonical key as city search, so the
  // default city and its search result do not create two separate favorites.
  const displayedCity = forecast?.location || city;
  const isFavorite = favorites.some(fav => fav.id === displayedCity.id);
  const weather = forecast && describeForecast(forecast.current);

  return (
    <>
      <label className="provider-choice">
        Weather provider
        <select
          value={provider}
          onChange={event =>
            setCity({
              ...TEL_AVIV,
              provider: event.target.value,
              id: event.target.value === "accuweather" ? "accuweather:tel-aviv" : TEL_AVIV.id,
            })
          }
        >
          <option value="open-meteo">Open-Meteo (original, no key)</option>
          <option value="accuweather">AccuWeather (server key)</option>
        </select>
      </label>
      <SearchBar key={provider} provider={provider} onSelect={setCity} />
      {!forecast && !error && <p role="status">Loading weather…</p>}
      {error && (
        <div>
          <p className="error" role="alert">
            {error}
          </p>
          <button onClick={() => setAttempt(value => value + 1)}>Retry weather</button>
        </div>
      )}
      {forecast && (
        <section className="card">
          <div className="current">
            <div>
              <h2>
                {displayedCity.name}, {displayedCity.country}
              </h2>
              <p className="big">
                {weather.icon} {forecast.current.temperature}°{unit}
              </p>
              <p>{weather.label}</p>
            </div>
            <button onClick={() => dispatch({ type: "toggleFavorite", city: displayedCity })}>
              {isFavorite ? "♥ Remove from favorites" : "♡ Add to favorites"}
            </button>
          </div>
          <ForecastList days={forecast.days} unit={unit} />
          <WeatherAttribution provider={provider} />
        </section>
      )}
    </>
  );
}

export default Home;
