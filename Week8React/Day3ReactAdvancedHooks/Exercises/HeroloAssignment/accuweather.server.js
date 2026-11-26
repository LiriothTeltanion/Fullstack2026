// Only this server module sees the account key. Browser code uses our local API.
const BASE = "https://dataservice.accuweather.com";
const finite = value => typeof value === "number" && Number.isFinite(value);
const text = value => typeof value === "string" && value.trim().length > 0;
const locationKey = value => typeof value === "string" && /^[A-Za-z0-9_-]{1,80}$/.test(value);

export class WeatherError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

function invalidData() {
  throw new WeatherError(502, "INVALID_RESPONSE", "AccuWeather returned incomplete weather data.");
}

function normalizeLocation(value) {
  if (
    !locationKey(value?.Key) ||
    !text(value.LocalizedName) ||
    !text(value.Country?.LocalizedName)
  ) {
    invalidData();
  }
  return {
    id: `accuweather:${value.Key}`,
    provider: "accuweather",
    locationKey: value.Key,
    name: value.LocalizedName,
    country: value.Country.LocalizedName,
  };
}

function iconFor(code) {
  if ([15, 16, 17, 41, 42].includes(code)) return "⛈️";
  if ([12, 13, 14, 18, 39, 40].includes(code)) return "🌧️";
  if ([19, 20, 21, 22, 23, 24, 25, 26, 29, 43, 44].includes(code)) return "❄️";
  if ([5, 11, 37].includes(code)) return "🌫️";
  if ([33, 34].includes(code)) return "🌙";
  if ([1, 2, 30].includes(code)) return "☀️";
  if ([3, 4, 35, 36].includes(code)) return "⛅";
  return "☁️";
}

export function createAccuWeather({
  apiKey = "",
  fetchImpl = fetch,
  timeoutMs = 8000,
  now = Date.now,
  maxRequests = 100,
} = {}) {
  // A small, in-memory, five-minute cache reduces duplicate page/unit requests.
  // It never stores the key or writes provider data to disk.
  const cache = new Map();
  let budgetStart = now();
  let requestsUsed = 0;
  async function checked(work) {
    try {
      return await work();
    } catch (error) {
      // An incomplete successful HTTP response must not poison the retry cache.
      if (error?.code === "INVALID_RESPONSE") cache.clear();
      throw error;
    }
  }
  async function get(path, params = {}) {
    if (!apiKey.trim() || apiKey.startsWith("replace-")) {
      throw new WeatherError(
        503,
        "NOT_CONFIGURED",
        "AccuWeather is not configured on this server. Choose Open-Meteo or configure the server key."
      );
    }
    const url = new URL(path, BASE);
    url.search = new URLSearchParams({ language: "en-us", ...params }).toString();
    const cached = cache.get(url.href);
    if (cached && cached.until > now()) return cached.value;
    if (now() >= budgetStart + 24 * 60 * 60 * 1000) {
      budgetStart = now();
      requestsUsed = 0;
    }
    if (requestsUsed >= maxRequests) {
      throw new WeatherError(
        429,
        "LOCAL_LIMIT",
        "This server's daily AccuWeather request limit was reached. Choose Open-Meteo or try later."
      );
    }
    requestsUsed += 1;
    let response;
    try {
      response = await fetchImpl(url, {
        headers: { Authorization: `Bearer ${apiKey.trim()}`, "Accept-Encoding": "gzip,deflate" },
        signal: AbortSignal.timeout(timeoutMs),
      });
    } catch (error) {
      if (error?.name === "TimeoutError" || error?.name === "AbortError") {
        throw new WeatherError(504, "TIMEOUT", "AccuWeather took too long to respond. Try again.");
      }
      throw new WeatherError(502, "UNAVAILABLE", "AccuWeather is unavailable. Try again.");
    }
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new WeatherError(
          502,
          "ACCESS_DENIED",
          "AccuWeather access was refused. Check the server key and its subscription."
        );
      }
      if (response.status === 429) {
        throw new WeatherError(
          429,
          "QUOTA",
          "AccuWeather's request limit was reached. Try later or choose Open-Meteo."
        );
      }
      throw new WeatherError(
        502,
        "UNAVAILABLE",
        "AccuWeather could not complete this request. Try again."
      );
    }
    let value;
    try {
      value = await response.json();
    } catch {
      invalidData();
    }
    const control = response.headers.get("cache-control") || "";
    let lifetime = 5 * 60 * 1000;
    const maxAge = control.match(/(?:^|,)\s*max-age\s*=\s*"?(\d+)/i);
    if (maxAge)
      lifetime = Math.min(
        lifetime,
        Math.max(0, Number(maxAge[1]) - Number(response.headers.get("age") || 0)) * 1000
      );
    const expires = Date.parse(response.headers.get("expires") || "");
    if (Number.isFinite(expires)) lifetime = Math.min(lifetime, Math.max(0, expires - now()));
    if (!/\b(?:no-store|no-cache)\b/i.test(control) && lifetime > 0) {
      if (cache.size >= 100) cache.delete(cache.keys().next().value);
      cache.set(url.href, { value, until: now() + lifetime });
    }
    return value;
  }

  return {
    async search(query) {
      return checked(async () => {
        if (typeof query !== "string" || !/^[A-Za-z\s-]{2,80}$/.test(query.trim())) {
          throw new WeatherError(
            400,
            "INPUT",
            "Enter a city using 2 to 80 English letters, spaces or hyphens."
          );
        }
        const data = await get("/locations/v1/cities/autocomplete", { q: query.trim() });
        if (!Array.isArray(data)) invalidData();
        return data
          .filter(value => value.Type === "City")
          .slice(0, 5)
          .map(normalizeLocation);
      });
    },
    async forecast({ key, latitude, longitude, unit = "C" }) {
      return checked(async () => {
        if (unit !== "C" && unit !== "F")
          throw new WeatherError(400, "INPUT", "Choose Celsius or Fahrenheit.");
        let selectedKey = key;
        let selectedPlace;
        if (key !== undefined) {
          if (!locationKey(key))
            throw new WeatherError(400, "INPUT", "Choose a valid city from the search results.");
        } else {
          const lat = typeof latitude === "string" && latitude.trim() ? Number(latitude) : NaN;
          const lng = typeof longitude === "string" && longitude.trim() ? Number(longitude) : NaN;
          if (!finite(lat) || !finite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
            throw new WeatherError(400, "INPUT", "Choose a city or valid geographic coordinates.");
          }
          const place = normalizeLocation(
            await get("/locations/v1/cities/geoposition/search", { q: `${lat},${lng}` })
          );
          selectedPlace = place;
          selectedKey = place.locationKey;
        }
        const [observations, daily] = await Promise.all([
          get(`/currentconditions/v1/${encodeURIComponent(selectedKey)}`),
          get(`/forecasts/v1/daily/5day/${encodeURIComponent(selectedKey)}`, {
            metric: String(unit === "C"),
          }),
        ]);
        const current = observations?.[0];
        const temperature = current?.Temperature?.[unit === "C" ? "Metric" : "Imperial"]?.Value;
        if (
          !Array.isArray(observations) ||
          !finite(temperature) ||
          !text(current?.WeatherText) ||
          !Number.isInteger(current?.WeatherIcon)
        )
          invalidData();
        if (!Array.isArray(daily?.DailyForecasts) || daily.DailyForecasts.length < 5) invalidData();
        const days = daily.DailyForecasts.slice(0, 5).map(day => {
          const min = day?.Temperature?.Minimum,
            max = day?.Temperature?.Maximum;
          if (
            !/^\d{4}-\d{2}-\d{2}T/.test(day?.Date ?? "") ||
            !finite(min?.Value) ||
            !finite(max?.Value) ||
            min.Unit !== unit ||
            max.Unit !== unit ||
            !text(day?.Day?.IconPhrase) ||
            !Number.isInteger(day?.Day?.Icon)
          )
            invalidData();
          return {
            date: day.Date.slice(0, 10),
            min: Math.round(min.Value),
            max: Math.round(max.Value),
            description: day.Day.IconPhrase,
            icon: iconFor(day.Day.Icon),
          };
        });
        return {
          provider: "accuweather",
          ...(selectedPlace ? { location: selectedPlace } : {}),
          current: {
            temperature: Math.round(temperature),
            description: current.WeatherText,
            icon: iconFor(current.WeatherIcon),
          },
          days,
        };
      });
    },
  };
}
