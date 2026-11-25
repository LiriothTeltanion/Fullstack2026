# 🎮 Mini Project - Weather App

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/weather-app-3ec8010478.svg" width="100%" alt="Progress card for Weather App">

</div>

A weather app built on the OpenWeatherMap API with the PyOWM library: current weather, city IDs, forecasts and air quality in the terminal, plus a bonus humidity chart.

## ▶️ How to run

You need your own OpenWeatherMap key in the `OWM_API_KEY` environment variable:

```bash
pip install pyowm matplotlib pytz
export OWM_API_KEY="your-key"     # Windows PowerShell: $env:OWM_API_KEY="your-key"
python weatherapp.py
python weathergui.py
```

`weatherapp.py` first prints the weather in Paris, then asks for a place like `Los Angeles,US`. `weathergui.py` asks for a city and opens a bar chart window.

## 🎯 The challenge

- [`weatherapp.py`](weatherapp.py) - terminal helpers:

  | Function | What it does |
  |---|---|
  | `current_weather_at_place(owm, place)` | Status, temperature in °C, wind, sunrise and sunset for `City,CC` |
  | `find_city_id(owm, query)` / `current_weather_at_id(owm, id)` | Finds a city ID with geocoding, then asks for the weather by ID |
  | `forecast_at_place`, `forecast_at_id`, `forecast_at_coords` | 5-day forecasts in 3-hour steps |
  | `air_quality_by_place(owm, place)` | The air quality index (1 Good to 5 Very Poor) and pollutant levels |

  The interactive part also prints the next five forecast entries.
- [`weathergui.py`](weathergui.py) - the Ninja bonus: it averages the forecast humidity per day and draws a Matplotlib bar chart for the next 3 days, with the value written on each bar (`init_plot`, `plot_temperatures`, `write_humidity_on_bar_chart`)

## 🧠 What I learned

- A library like PyOWM wraps the raw API calls in readable objects and methods
- API keys belong in environment variables, not in the code
- Times from an API come in UTC, so I convert them before showing or grouping by day
- Matplotlib only needs a few calls to turn a list of numbers into a labeled chart

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 2 Day 5 - Mini-projects - Mini Project
