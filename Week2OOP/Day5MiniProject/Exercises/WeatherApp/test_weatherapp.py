"""Regressions using PyOWM objects with synthetic HTTP responses."""

import contextlib
import copy
import io
import unittest
from unittest.mock import patch

from pyowm import OWM

import weatherapp


CURRENT_WEATHER = {
    "coord": {"lon": 2.3486, "lat": 48.8534},
    "weather": [{"id": 800, "main": "Clear", "description": "clear sky", "icon": "01d"}],
    "main": {"temp": 291.15, "feels_like": 291.15, "temp_min": 290.15,
             "temp_max": 292.15, "pressure": 1013, "humidity": 60},
    "wind": {"speed": 3.2, "deg": 180},
    "clouds": {"all": 0},
    "dt": 1795680000,
    "sys": {"country": "FR", "sunrise": 1795650000, "sunset": 1795683600},
    "timezone": 3600,
    "id": 2968815,
    "name": "Paris",
    "cod": 200,
}
FORECAST = {
    "cod": "200", "message": 0, "cnt": 1,
    "city": {"id": 2968815, "name": "Paris", "country": "FR",
             "coord": {"lat": 48.8534, "lon": 2.3486}, "timezone": 3600},
    "list": [dict(CURRENT_WEATHER, dt_txt="2026-11-26 12:00:00", pop=0)],
}
AIR_QUALITY = {
    "coord": {"lat": 48.8534, "lon": 2.3486},
    "list": [{"dt": 1795680000, "main": {"aqi": 2},
              "components": {"co": 200, "no": 0.1, "no2": 5, "o3": 60,
                             "so2": 1, "pm2_5": 7, "pm10": 12, "nh3": 0.5}}],
}
LOCATION = [{"name": "Paris", "country": "FR", "lat": 48.8534, "lon": 2.3486}]


class WeatherAppTests(unittest.TestCase):
    def setUp(self):
        # A placeholder constructs the SDK; no request reaches the network.
        self.client = OWM("fixture-only")
        self.weather = self.client.weather_manager()
        self.geocoding = self.client.geocoding_manager()
        self.pollution = self.client.airpollution_manager()
        for factory, manager in (("weather_manager", self.weather),
                                 ("geocoding_manager", self.geocoding),
                                 ("airpollution_manager", self.pollution)):
            self.enterContext(patch.object(self.client, factory, return_value=manager))
        self.http = self.enterContext(patch.object(self.weather.http_client, "get_json"))
        self.http.side_effect = lambda path, **kwargs: (
            200, copy.deepcopy(FORECAST if "forecast" in path else CURRENT_WEATHER)
        )
        self.enterContext(patch.object(self.geocoding.http_client, "get_json",
                                      return_value=(200, LOCATION)))
        self.air_http = self.enterContext(patch.object(
            self.pollution.new_ap_client, "get_air_pollution",
            side_effect=lambda params: copy.deepcopy(AIR_QUALITY)
        ))

    def test_city_id_uses_registry_and_prefers_complete_name(self):
        # The real geocoding object has no ID. The registry supplies the correct
        # ID even when Villeparisis precedes Paris in the substring results.
        location = self.geocoding.geocode("Paris", country="FR")[0]
        self.assertIsNone(location.id)
        self.assertEqual(weatherapp.find_city_id(self.client, " paris ", country=" fr "),
                         2968815)
        info = weatherapp.current_weather_at_id(self.client, 2968815)
        self.assertEqual(info["place"], "Paris,FR")
        self.assertEqual(info["temp_c"], 18)
        self.assertEqual(self.http.call_args.kwargs["params"]["id"], 2968815)

    def test_missing_city_or_country_returns_no_id(self):
        self.assertIsNone(weatherapp.find_city_id(self.client, ""))
        self.assertIsNone(weatherapp.find_city_id(self.client, "NoSuchCityFixture"))
        self.assertIsNone(weatherapp.find_city_id(self.client, "Paris", country="IL"))

    def test_air_quality_parses_sdk_values(self):
        result = weatherapp.air_quality_by_place(self.client, "Paris,FR")
        self.assertEqual((result["aqi"], result["aqi_label"], result["pm2_5"]),
                         (2, "Fair", 7))
        self.assertEqual(result["coords"], (48.8534, 2.3486))

    def test_unavailable_air_quality_is_not_an_observation(self):
        # PyOWM returns None when its HTTP response cannot yield an AirStatus.
        self.air_http.side_effect = None
        self.air_http.return_value = {"coord": {"lat": 48.8534, "lon": 2.3486}}
        self.assertIsNone(weatherapp.air_quality_by_place(self.client, "Paris,FR"))

    def test_forecast_accepts_each_supported_location_form(self):
        forecasts = [weatherapp.forecast_at_place(self.client, "Paris,FR"),
                     weatherapp.forecast_at_id(self.client, 2968815),
                     weatherapp.forecast_at_coords(self.client, 48.8534, 2.3486)]
        self.assertTrue(all(item.forecast.weathers[0].humidity == 60 for item in forecasts))
        self.assertEqual(self.http.call_args.kwargs["params"]["lat"], 48.8534)
        self.assertEqual(self.http.call_args.kwargs["params"]["lon"], 2.3486)

    def test_interactive_displays_id_air_quality_and_forecast(self):
        output = io.StringIO()
        with patch.object(weatherapp, "make_owm", return_value=self.client), \
                patch("builtins.input", return_value="Paris,FR"), \
                contextlib.redirect_stdout(output):
            weatherapp.interactive()
        rendered = output.getvalue()
        self.assertIn("Queried by city ID: 2968815", rendered)
        self.assertIn("AQI: 2", rendered)
        self.assertIn("Fair", rendered)
        self.assertIn("RH 60%", rendered)

    def test_missing_key_reports_actionable_error(self):
        with patch.dict("os.environ", {}, clear=True):
            with self.assertRaisesRegex(RuntimeError, "OWM_API_KEY"):
                weatherapp.make_owm()


if __name__ == "__main__":
    unittest.main()
