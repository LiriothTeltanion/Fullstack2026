import { useState } from "react";
import MapCanvas from "./MapCanvas.jsx";
import { parseCoordinates } from "./coordinates.js";

const cityCenter = { lat: 31.2518, lng: 34.7913 };
export default function App() {
  const [latitude, setLatitude] = useState(String(cityCenter.lat));
  const [longitude, setLongitude] = useState(String(cityCenter.lng));
  const [center, setCenter] = useState(cityCenter);
  const [error, setError] = useState("");
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim() ?? "";
  const configured = apiKey && !apiKey.startsWith("replace-");
  function handleSubmit(event) {
    event.preventDefault();
    const result = parseCoordinates(latitude, longitude);
    if (result.error) {
      setError(result.error);
      return;
    }
    setError("");
    setCenter(result);
  }

  return (
    <main className="container py-4">
      <h1 className="mb-3">Coordinates on Google Maps</h1>
      <p className="text-secondary">
        Choose latitude and longitude to center the map and move its marker.
      </p>
      <form className="row g-3 mb-3" onSubmit={handleSubmit} noValidate>
        <div className="col-md-5">
          <label htmlFor="latitude" className="form-label">
            Latitude
          </label>
          <input
            id="latitude"
            className="form-control"
            type="number"
            step="any"
            min="-90"
            max="90"
            value={latitude}
            onChange={event => setLatitude(event.target.value)}
          />
        </div>
        <div className="col-md-5">
          <label htmlFor="longitude" className="form-label">
            Longitude
          </label>
          <input
            id="longitude"
            className="form-control"
            type="number"
            step="any"
            min="-180"
            max="180"
            value={longitude}
            onChange={event => setLongitude(event.target.value)}
          />
        </div>
        <div className="col-md-2 align-self-end">
          <button type="submit" className="btn btn-primary w-100">
            Show location
          </button>
        </div>
      </form>
      {error && (
        <p role="alert" className="alert alert-danger">
          {error}
        </p>
      )}
      <p role="status">
        Selected location: {center.lat}, {center.lng}
      </p>
      {configured ? (
        <MapCanvas center={center} apiKey={apiKey} />
      ) : (
        <div className="alert alert-warning">
          Set VITE_GOOGLE_MAPS_API_KEY in .env.local and restart Vite to load the map. Use your own
          website-restricted Maps JavaScript API key or a Maps Demo Key.
        </div>
      )}
      <p className="mt-3">
        <a
          href={
            "https://www.google.com/maps/search/?api=1&query=" +
            encodeURIComponent(center.lat + "," + center.lng)
          }
          target="_blank"
          rel="noreferrer"
        >
          Open selected coordinates in Google Maps
        </a>
      </p>
    </main>
  );
}
