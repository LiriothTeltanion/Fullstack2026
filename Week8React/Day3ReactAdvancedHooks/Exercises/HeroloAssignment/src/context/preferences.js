function defaults() {
  return { favorites: [], unit: "C", dark: false };
}

function isSavedCity(city) {
  if (!city || typeof city !== "object" || Array.isArray(city)) return false;
  const validId =
    (typeof city.id === "number" && Number.isFinite(city.id)) ||
    (typeof city.id === "string" && city.id.trim().length > 0);
  if (!validId || typeof city.name !== "string" || !city.name.trim()) return false;
  if (city.country !== undefined && typeof city.country !== "string") return false;

  // Legacy Open-Meteo favorites store coordinates. AccuWeather favorites can
  // instead carry a canonical location key; keep either supported shape intact.
  if (
    city.provider === "accuweather" &&
    typeof city.locationKey === "string" &&
    city.locationKey.trim()
  )
    return true;
  return (
    Number.isFinite(city.latitude) &&
    Math.abs(city.latitude) <= 90 &&
    Number.isFinite(city.longitude) &&
    Math.abs(city.longitude) <= 180
  );
}

export function parseWeatherPreferences(raw) {
  let saved;
  try {
    saved = JSON.parse(raw);
  } catch {
    return defaults();
  }
  if (!saved || typeof saved !== "object" || Array.isArray(saved)) return defaults();

  // JSON can be valid while its fields are not. Validate before Home/Favorites
  // call array methods, retaining every usable favorite and its original fields.
  return {
    favorites: Array.isArray(saved.favorites) ? saved.favorites.filter(isSavedCity) : [],
    unit: saved.unit === "F" ? "F" : "C",
    dark: typeof saved.dark === "boolean" ? saved.dark : false,
  };
}
