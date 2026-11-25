// Daily Challenge: Promise.all() (Week 4, Day 5)
// Two requests to sunrise-sunset.org start at the same time. Promise.all waits
// for both, so the page never shows one city without the other.

const form = document.getElementById("sunrise-form");
const result = document.getElementById("result");

// One request: today's sunrise for a latitude and longitude.
// formatted=0 returns ISO 8601 times in UTC, which I format myself below
async function getSunrise(lat, lng) {
  const url = new URL("https://api.sunrise-sunset.org/json");
  url.searchParams.set("lat", lat);
  url.searchParams.set("lng", lng);
  url.searchParams.set("formatted", "0");

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${lat}, ${lng}`);
  }
  const json = await response.json();
  // The API answers 200 with status "INVALID_REQUEST" for bad coordinates
  if (json.status !== "OK") {
    throw new Error(`The API said ${json.status} for ${lat}, ${lng}`);
  }
  return json.results.sunrise;
}

function readCoordinates(prefix) {
  const lat = Number(form.elements[`lat${prefix}`].value);
  const lng = Number(form.elements[`lng${prefix}`].value);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    throw new Error(`City ${prefix} needs a latitude and a longitude.`);
  }
  return { lat, lng };
}

function formatUtcTime(isoString) {
  return new Date(isoString).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  result.textContent = "Asking for both sunrises…";

  try {
    const first = readCoordinates(1);
    const second = readCoordinates(2);

    // Both fetches are already running before await; Promise.all rejects as
    // soon as one of them fails, so the catch below handles either city
    const [sunrise1, sunrise2] = await Promise.all([
      getSunrise(first.lat, first.lng),
      getSunrise(second.lat, second.lng),
    ]);

    result.textContent =
      `City 1 (${first.lat}, ${first.lng}): sunrise at ${formatUtcTime(sunrise1)} UTC\n` +
      `City 2 (${second.lat}, ${second.lng}): sunrise at ${formatUtcTime(sunrise2)} UTC`;
  } catch (error) {
    result.textContent = `Something went wrong: ${error.message}`;
  }
});
