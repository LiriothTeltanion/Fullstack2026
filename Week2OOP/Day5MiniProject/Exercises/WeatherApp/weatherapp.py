"""
File: weatherapp.py
Role: CLI helpers for the Weather App mini-project using PyOWM. 🌦️🗺️
Note:
  • Requires an OpenWeatherMap API key (export OWM_API_KEY="..."). 🔑
  • Uses PyOWM managers for current weather, forecast, geocoding, and air pollution.
  • Emoji-rich comments included as requested. ✨
"""

from __future__ import annotations

import os
from contextlib import closing
from datetime import datetime, timezone
from typing import Any, Dict, Iterable, List, Optional, Tuple

try:
    from pyowm import OWM
except Exception as e:  # pragma: no cover
    raise SystemExit("PyOWM is not installed. Install with: pip install pyowm") from e


# ---------------------- Utilities ⚙️ ----------------------
def make_owm(api_key: Optional[str] = None) -> OWM:
    """Create an OWM client from env var or given key. 🔑"""
    key = api_key or os.getenv("OWM_API_KEY")
    if not key:
        raise RuntimeError("Missing API key. Set env var OWM_API_KEY or pass api_key.")
    return OWM(key)


def fmt_dt(dt: datetime) -> str:
    """Pretty format datetime in local time. 🕒"""
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    local = dt.astimezone()  # convert to local tz
    return local.strftime("%Y-%m-%d %H:%M")


def wind_to_str(wind: Dict[str, Any]) -> str:
    """Human-readable wind dict from PyOWM. 🍃"""
    speed = wind.get("speed")
    deg = wind.get("deg")
    gust = wind.get("gust")
    parts = []
    if speed is not None:
        parts.append(f"{speed} m/s")
    if deg is not None:
        parts.append(f"{deg}°")
    if gust is not None:
        parts.append(f"gust {gust} m/s")
    return ", ".join(parts) if parts else "n/a"


# ---------------------- Current Weather 🌤️ ----------------------
def current_weather_at_place(owm: OWM, place: str) -> Dict[str, Any]:
    """Return current weather info for 'City,CC' (e.g., 'Paris,FR'). 🗺️"""
    wm = owm.weather_manager()
    obs = wm.weather_at_place(place)
    w = obs.weather
    info = {
        "place": place,
        "status": w.status,
        "detailed_status": w.detailed_status,
        "temp_c": w.temperature("celsius").get("temp"),
        "wind": wind_to_str(w.wind()),
        "sunrise": fmt_dt(w.sunrise_time(timeformat="date")),
        "sunset": fmt_dt(w.sunset_time(timeformat="date")),
    }
    return info


def current_weather_at_id(owm: OWM, city_id: int) -> Dict[str, Any]:
    """Return current weather by OpenWeather city ID. 🆔"""
    wm = owm.weather_manager()
    obs = wm.weather_at_id(city_id)
    w = obs.weather
    loc = obs.location
    label = f"{loc.name},{(loc.country or '').upper()}" if loc else f"id:{city_id}"
    info = {
        "place": label,
        "status": w.status,
        "detailed_status": w.detailed_status,
        "temp_c": w.temperature("celsius").get("temp"),
        "wind": wind_to_str(w.wind()),
        "sunrise": fmt_dt(w.sunrise_time(timeformat="date")),
        "sunset": fmt_dt(w.sunset_time(timeformat="date")),
    }
    return info


# ---------------------- Geocoding 🔎 ----------------------
def find_city_id(owm: OWM, query: str, *, country: Optional[str] = None) -> Optional[int]:
    """Find a city ID in PyOWM's local registry, optionally filtered by country. 🧭"""
    # Direct geocoding returns coordinates without city IDs. The bundled registry
    # supports ID-based weather queries without an extra API request.
    query = query.strip()
    registry = owm.city_id_registry()
    with closing(registry.connection):
        results = registry.ids_for(
            query, country=country.strip().upper() if country else None, matching="like"
        )
    if not results:
        return None
    # Prefer Paris over Villeparisis while retaining substring searches.
    city = next((row for row in results if row[1].casefold() == query.casefold()), results[0])
    return city[0]


# ---------------------- Forecasts 📅 ----------------------
def forecast_at_place(owm: OWM, place: str, interval: str = "3h"):
    """Return a Forecaster object for a place (interval '3h' for 5-day). 🔁"""
    return owm.weather_manager().forecast_at_place(place, interval)


def forecast_at_id(owm: OWM, city_id: int, interval: str = "3h"):
    """Return a Forecaster object by city ID. 🔁"""
    return owm.weather_manager().forecast_at_id(city_id, interval)


def forecast_at_coords(owm: OWM, lat: float, lon: float, interval: str = "3h"):
    """Return a Forecaster object by coordinates. 🔁"""
    return owm.weather_manager().forecast_at_coords(lat=lat, lon=lon, interval=interval)


# ---------------------- Air Pollution 🫁 ----------------------
_AQI_MAP = {
    1: "Good",
    2: "Fair",
    3: "Moderate",
    4: "Poor",
    5: "Very Poor",
}

def air_quality_by_place(owm: OWM, place: str) -> Optional[Dict[str, Any]]:
    """Resolve place to coords, then retrieve Air Pollution (AQI + components). 🧪"""
    gm = owm.geocoding_manager()
    matches = gm.geocode(place, limit=1)
    if not matches:
        return None
    loc = matches[0]
    apm = owm.airpollution_manager()
    aq = apm.air_quality_at_coords(loc.lat, loc.lon)
    if aq is None:
        return None
    # PyOWM exposes EU AQI and pollutant micrograms/m^3
    data = {
        "place": f"{loc.name},{loc.country}",
        "aqi": getattr(aq, "aqi", None),
        "aqi_label": _AQI_MAP.get(getattr(aq, "aqi", None)),
        "co": getattr(aq, "co", None),
        "no": getattr(aq, "no", None),
        "no2": getattr(aq, "no2", None),
        "o3": getattr(aq, "o3", None),
        "so2": getattr(aq, "so2", None),
        "pm2_5": getattr(aq, "pm2_5", None),
        "pm10": getattr(aq, "pm10", None),
        "nh3": getattr(aq, "nh3", None),
        "coords": (loc.lat, loc.lon),
    }
    return data


# ---------------------- Pretty printers 🖨️ ----------------------
def print_current(info: Dict[str, Any]) -> None:
    """Display current weather info. 🌤️"""
    print(f"\nWeather for {info['place']}:")
    print(f"  Status: {info['status']} — {info['detailed_status']}")
    print(f"  Temperature: {info['temp_c']} °C")
    print(f"  Wind: {info['wind']}")
    print(f"  Sunrise: {info['sunrise']} | Sunset: {info['sunset']}")


def print_air_quality(aqi: Dict[str, Any]) -> None:
    """Display air quality details. 🫁"""
    print(f"\nAir Quality for {aqi['place']} (lat={aqi['coords'][0]:.3f}, lon={aqi['coords'][1]:.3f}):")
    print(f"  AQI: {aqi['aqi']} — {aqi['aqi_label']}")
    print("  Components (μg/m³):")
    for k in ("pm2_5", "pm10", "o3", "no2", "so2", "co", "nh3", "no"):
        v = aqi.get(k)
        if v is not None:
            print(f"    {k}: {v}")


# ---------------------- Demo / CLI 🧑‍💻 ----------------------
def demo_paris() -> None:
    """Show current Paris weather, wind, sunrise/sunset. 🇫🇷"""
    owm = make_owm()
    info = current_weather_at_place(owm, "Paris,FR")
    print_current(info)


def interactive() -> None:
    """Ask user for a location and display current weather + AQ. 🧭"""
    owm = make_owm()
    place = input("Enter a location (e.g., 'Paris,FR' or 'Los Angeles,US'): ").strip()
    info = current_weather_at_place(owm, place)
    print_current(info)

    # Resolve to city ID and show ID-based query 🔎
    cid = find_city_id(owm, place.split(",")[0], country=place.split(",")[1] if "," in place else None)
    if cid:
        info2 = current_weather_at_id(owm, cid)
        print_current(info2)
        print(f"(Queried by city ID: {cid})")

    # Air quality
    aq = air_quality_by_place(owm, place)
    if aq:
        print_air_quality(aq)

    # Forecast preview (3h intervals, first 5 entries) 📅
    fc = forecast_at_place(owm, place, "3h")
    f = fc.forecast
    entries = getattr(f, "weathers", [])[:5]
    if entries:
        print("\nNext 5 forecast entries (3h):")
        for w in entries:
            when = fmt_dt(w.reference_time("date"))
            hum = w.humidity
            print(f"  {when}: {w.status} / {w.detailed_status}, {w.temperature('celsius')['temp']} °C, RH {hum}%")


if __name__ == "__main__":
    # Quick guide: set OWM_API_KEY, then run this file directly to try Paris and an interactive query.
    print("=== Weather App Demo ===")
    try:
        demo_paris()
    except Exception as e:
        print("Paris demo failed:", e)
    try:
        interactive()
    except (EOFError, KeyboardInterrupt):
        print("\nExiting interactive mode.")
    except Exception as e:
        print("Interactive demo failed:", e)
