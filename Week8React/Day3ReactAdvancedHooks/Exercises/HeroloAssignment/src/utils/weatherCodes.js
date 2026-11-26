// WMO weather codes grouped into a few readable labels.
const groups = [
  { codes: [0], label: "Clear sky", icon: "☀️" },
  { codes: [1, 2], label: "Partly cloudy", icon: "⛅" },
  { codes: [3], label: "Cloudy", icon: "☁️" },
  { codes: [45, 48], label: "Fog", icon: "🌫️" },
  { codes: [51, 53, 55, 56, 57], label: "Drizzle", icon: "🌦️" },
  { codes: [61, 63, 65, 66, 67, 80, 81, 82], label: "Rain", icon: "🌧️" },
  { codes: [71, 73, 75, 77, 85, 86], label: "Snow", icon: "❄️" },
  { codes: [95, 96, 99], label: "Thunderstorm", icon: "⛈️" },
];

export function describeWeather(code) {
  return groups.find(group => group.codes.includes(code)) || { label: "Unknown", icon: "❔" };
}

// AccuWeather's icon numbers are not WMO codes; its adapter supplies a phrase.
export function describeForecast(condition) {
  return condition.description
    ? { label: condition.description, icon: condition.icon || "🌡️" }
    : describeWeather(condition.code);
}

export function dayName(isoDate) {
  return new Date(`${isoDate}T12:00:00`).toLocaleDateString("en-US", { weekday: "short" });
}
