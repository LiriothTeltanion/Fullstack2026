# 🎮 Mini Project - Weather App

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/weather-app-3ec8010478.svg" width="100%" alt="Progress card for Weather App">

</div>

My weather app talks to OpenWeatherMap through the PyOWM library. In the terminal it shows the current weather, city IDs, forecasts and air quality, and a second script draws a humidity chart.

## ▶️ How to run

You need your own OpenWeatherMap key in the `OWM_API_KEY` environment variable:

```bash
pip install pyowm matplotlib pytz
export OWM_API_KEY="your-key"     # Windows PowerShell: $env:OWM_API_KEY="your-key"
python weatherapp.py
python weathergui.py
```

`weatherapp.py` shows Paris first, then asks for a place like `Los Angeles,US`. `weathergui.py` asks for a city (Enter means `Paris,FR`) and opens a chart. Without a key you get `Paris demo failed: Missing API key...`, not a crash.

## 🎯 The challenge

- [`weatherapp.py`](weatherapp.py), the terminal part:

  | Function | What it does |
  |---|---|
  | `current_weather_at_place(owm, place)` | Status, temperature in °C, wind, sunrise and sunset for a `City,CC` string |
  | `find_city_id(owm, query)` / `current_weather_at_id(owm, id)` | Looks up a city ID in PyOWM's bundled registry, then gets the weather for that ID |
  | `forecast_at_place`, `forecast_at_id`, `forecast_at_coords` | The 5-day forecast in 3-hour steps, by name, ID or coordinates |
  | `air_quality_by_place(owm, place)` | Air quality index from 1 (Good) to 5 (Very Poor) plus pollutant levels in μg/m³ |

  After the air quality, the interactive part lists the next five forecast entries with their humidity.
- [`weathergui.py`](weathergui.py), the Ninja bonus: it groups the 3-hour forecasts by local day, averages the humidity and draws a Matplotlib bar chart for the next 3 days with the percentage written on each bar (`init_plot`, `plot_temperatures`, `write_humidity_on_bar_chart`)

The names come from the brief, so `plot_temperatures()` actually draws humidity.

## 🧠 What I learned

- PyOWM hides the raw HTTP calls behind managers like `weather_manager()` and `airpollution_manager()`
- `make_owm()` reads the key from `OWM_API_KEY`, so nothing secret is written in the files
- Forecast times arrive in UTC, and I convert them to local time before grouping by day, or the days come out shifted
- `ax.bar()` plus one `ax.text()` per bar is all the chart needs

## 🧪 Verification

Run the regression checks from this folder after installing the dependencies above:

```bash
python -m unittest -v test_weatherapp
```

Seven tests cover city ID lookup, country filtering, unknown cities, current weather
by ID, forecasts by name/ID/coordinates, air quality, missing configuration and the
interactive output. They use real PyOWM managers and synthetic HTTP responses.
The local city registry supplies IDs because direct geocoding returns coordinates
without an ID. If air quality is unavailable, the app skips that observation.

Verified on 2026-11-26 with Python 3.14.7 and PyOWM 3.5.0. Live weather calls require
an authorized OpenWeatherMap key and service access. These regression checks run
without a key or external requests.

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 2 Day 5 - Mini-projects - Mini Project
