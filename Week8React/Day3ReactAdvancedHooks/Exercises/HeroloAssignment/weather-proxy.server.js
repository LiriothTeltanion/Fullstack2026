import { createAccuWeather, WeatherError } from "./accuweather.server.js";

export function createWeatherProxy(options = {}) {
  const provider = createAccuWeather(options);
  return async function weatherProxy(request, response, next) {
    const send = (status, body) => {
      response.writeHead(status, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      });
      response.end(JSON.stringify(body));
    };
    let url;
    try {
      url = new URL(request.url, "http://localhost");
    } catch {
      return send(400, { error: "The request URL is invalid." });
    }
    if (!url.pathname.startsWith("/api/weather/")) return next?.();
    if (request.method !== "GET")
      return send(405, { error: "Only GET weather requests are supported." });
    try {
      let data;
      if (url.pathname === "/api/weather/accuweather/locations") {
        data = await provider.search(url.searchParams.get("q"));
      } else if (url.pathname === "/api/weather/accuweather/forecast") {
        data = await provider.forecast({
          key: url.searchParams.has("key") ? url.searchParams.get("key") : undefined,
          latitude: url.searchParams.get("latitude"),
          longitude: url.searchParams.get("longitude"),
          unit: url.searchParams.get("unit") || "C",
        });
      } else return send(404, { error: "Weather endpoint not found." });
      send(200, data);
    } catch (error) {
      // Never forward raw upstream bodies, URLs, headers or exception messages.
      if (error instanceof WeatherError)
        return send(error.status, { error: error.message, code: error.code });
      send(500, { error: "The weather proxy could not complete this request." });
    }
  };
}
