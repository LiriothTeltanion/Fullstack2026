import axios from "axios";

export async function cityWeather(query, client = axios) {
  const name = query.trim();
  if (!name) throw new Error("Enter a city name.");
  const places = await client.get("https://geocoding-api.open-meteo.com/v1/search", {
    params: { name, count: 1, language: "en", format: "json" },
    timeout: 8000,
  });
  const place = places.data?.results?.[0];
  if (!place) throw new Error(`No city found for "${name}".`);
  if (!Number.isFinite(place.latitude) || !Number.isFinite(place.longitude) || !place.name) {
    throw new Error("The city service returned an incomplete location.");
  }
  const { data } = await client.get("https://api.open-meteo.com/v1/forecast", {
    params: {
      latitude: place.latitude,
      longitude: place.longitude,
      timezone: "auto",
      current: "temperature_2m,wind_speed_10m",
      temperature_unit: "celsius",
      wind_speed_unit: "kmh",
    },
    timeout: 8000,
  });
  const current = data?.current;
  if (
    !current?.time ||
    !Number.isFinite(current.temperature_2m) ||
    !Number.isFinite(current.wind_speed_10m)
  ) {
    throw new Error("The weather service has no complete current reading for this city.");
  }
  return {
    location: [place.name, place.admin1, place.country].filter(Boolean).join(", "),
    time: current.time,
    zone: data.timezone || "local time",
    temperature: current.temperature_2m,
    wind: current.wind_speed_10m,
  };
}
