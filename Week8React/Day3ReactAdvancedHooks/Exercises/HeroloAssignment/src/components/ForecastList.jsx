import { dayName, describeForecast } from "../utils/weatherCodes.js";

function ForecastList({ days, unit }) {
  return (
    <div className="forecast">
      {days.map(day => {
        const weather = describeForecast(day);
        return (
          <div key={day.date} className="day card">
            <strong>{dayName(day.date)}</strong>
            <span className="icon" role="img" aria-label={weather.label}>
              {weather.icon}
            </span>
            <span>
              {day.min}° / {day.max}°{unit}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default ForecastList;
