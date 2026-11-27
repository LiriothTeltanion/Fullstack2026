// Open-Meteo needs no API key, so the app runs without any setup.
const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

async function getJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    // Only our same-origin proxy's explicitly sanitized error is displayed.
    if (url.startsWith("/api/weather/")) {
      const data = await response.json().catch(() => ({}));
      throw new Error(
        typeof data.error === "string" ? data.error : "The weather proxy is unavailable."
      );
    }
    throw new Error(`Weather service error ${response.status}`);
  }
  return response.json();
}

export async function searchCities(query, provider = "open-meteo") {
  if (provider === "accuweather") {
    return getJson(`/api/weather/accuweather/locations?${new URLSearchParams({ q: query })}`);
  }
  const params = new URLSearchParams({ name: query, count: "5", language: "en" });
  const data = await getJson(`${GEO_URL}?${params}`);
  return (data.results || []).map(place => ({
    id: place.id,
    name: place.name,
    country: place.country,
    latitude: place.latitude,
    longitude: place.longitude,
  }));
}

export async function getForecast(city, unit) {
  if (city.provider === "accuweather") {
    const params = new URLSearchParams({ unit });
    if (city.locationKey) params.set("key", city.locationKey);
    else {
      params.set("latitude", String(city.latitude));
      params.set("longitude", String(city.longitude));
    }
    return getJson(`/api/weather/accuweather/forecast?${params}`);
  }
  const params = new URLSearchParams({
    latitude: city.latitude,
    longitude: city.longitude,
    current: "temperature_2m,weather_code",
    daily: "weather_code,temperature_2m_max,temperature_2m_min",
    temperature_unit: unit === "F" ? "fahrenheit" : "celsius",
    timezone: "auto",
    forecast_days: "5",
  });
  const data = await getJson(`${FORECAST_URL}?${params}`);
  const { current, daily } = data ?? {};
  const dates = daily?.time;
  // JSON null would otherwise round to zero and look like a real measurement.
  if (
    !Number.isFinite(current?.temperature_2m) ||
    !Array.isArray(dates) ||
    dates.length === 0 ||
    ![daily.temperature_2m_min, daily.temperature_2m_max].every(
      series =>
        Array.isArray(series) && series.length === dates.length && series.every(Number.isFinite)
    )
  ) {
    throw new Error("Open-Meteo returned incomplete temperatures. Please try again.");
  }
  return {
    current: {
      temperature: Math.round(current.temperature_2m),
      code: current.weather_code,
    },
    days: dates.map((date, i) => ({
      date,
      code: daily.weather_code?.[i],
      max: Math.round(daily.temperature_2m_max[i]),
      min: Math.round(daily.temperature_2m_min[i]),
    })),
  };
}
