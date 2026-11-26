export default function WeatherAttribution({ provider }) {
  if (provider !== "accuweather") return <p className="muted">Weather data: Open-Meteo</p>;
  return (
    <p className="weather-attribution">
      <a href="https://www.accuweather.com" target="_blank" rel="noreferrer">
        <img
          src="https://developer.accuweather.com/AccuWeatherLogoLight.svg"
          width="150"
          height="35"
          alt="AccuWeather"
        />
      </a>
      <span>Weather data provided by AccuWeather.</span>
    </p>
  );
}
